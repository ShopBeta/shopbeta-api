const express = require('express')
// utils
const makeValidation = require('@withvoid/make-validation')
// models
const { CHAT_ROOM_TYPES } = require('../models/room')
const { ChatRoom } = require('../models/room')
const { ChatMessage } = require('../models/message')
const { User } = require('../models/user')

const router = express.Router();

router.get('/chat/:userId', async (req, res) => {
  try {
    const currentLoggedUser = req.params.userId

    const options = {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 10,
    };
    console.log(currentLoggedUser)

    const rooms = await ChatRoom.getChatRoomsByUserId(currentLoggedUser)
    const roomIds = rooms.map(room => room._id);
    const recentConversation = await ChatMessage.getRecentConversation(
      roomIds, options, currentLoggedUser
    )
    
    res.status(200).send(rooms.reverse())
    // return res.status(200).json({ success: true, conversation: recentConversation })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
})

router.get('/chat/messages/:roomId', async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await ChatRoom.getChatRoomByRoomId(roomId)
    if (!room) {
      return res.status(400).json({
        success: false,
        message: 'No room exists for this id',
      })
    }

    const options = {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 10,
    };
    
    const messages = await ChatMessage.getMessagesByRoomId(roomId)
    res.status(200).send(messages)

    const conversation = await ChatMessage.getConversationByRoomId(roomId, options);
    // return res.status(200).json({
    //   success: true,
    //   messages,
    //   conversation,
    //   users,
    // });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
})

router.get('/chat/:roomId/users', async (req, res) => {
  try {
    const { roomId } = req.params.roomId;
    const room = await ChatRoom.getChatRoomByRoomId(roomId)
    if (!room) {
      return res.status(400).json({
        success: false,
        message: 'No room exists for this id',
      })
    }
    const users = await User.getUserByIds(room.userIds);
    return res.status(200).send(users[0])
  } catch (error) {
    return res.status(500).json({ success: false, error })
  }
})

router.post('/chat/initiate', async (req, res) => {
    try {
      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          userIds: { 
            type: types.array, 
            options: { unique: true, empty: false, stringOnly: true } 
          },
          type: { type: types.enum, options: { enum: CHAT_ROOM_TYPES } },
        }
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const { userIds, type } = req.body;
      const { userId: chatInitiator } = req;
      const allUserIds = [...userIds, chatInitiator];
      const chatRoom = await ChatRoom.initiateChat(allUserIds, type, chatInitiator);

      res.send(chatRoom)
      // return res.status(200).json({ success: true, chatRoom });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
})

router.post('/chat/:roomId/message/:userId', async (req, res) => {
  try {
    const { roomId } = req.params.roomId;
    const validation = makeValidation(types => ({
      payload: req.body,
      checks: {
        messageText: { type: types.string },
      }
    }));
    if (!validation.success) return res.status(400).json({ ...validation });

    const messagePayload = {
      messageText: req.body.messageText,
    }
    const currentLoggedUser = req.params.userId

    const post = await ChatMessage.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);
    global.io.sockets.in(roomId).emit('new message', { message: post });
    return res.status(200).json({ success: true, post });
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
})

router.put('/chat/:roomId/mark-read/:id', async (req, res) => {
  try {
    const { roomId } = req.params.roomId;
    const room = await ChatRoom.getChatRoomByRoomId(roomId)
    if (!room) {
      return res.status(400).json({
        success: false,
        message: 'No room exists for this id',
      })
    }

    const currentLoggedUser = req.params.id
    const result = await ChatMessage.markMessageRead(roomId, currentLoggedUser);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
})

router.delete('/room/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params.roomId;
    const room = await ChatRoom.remove({ _id: roomId })
    const messages = await ChatMessage.remove({ chatRoomId: roomId })
    return res.status(200).json({ 
      success: true, 
      message: "Operation performed succesfully",
      deletedRoomsCount: room.deletedCount,
      deletedMessagesCount: messages.deletedCount,
    })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
})

router.delete('/message/:messageId',  async (req, res) => {
try {
  const { messageId } = req.params.messageId;
  const message = await ChatMessage.remove({ _id: messageId })
  return res.status(200).json({ 
    success: true, 
    deletedMessagesCount: message.deletedCount,
  })
} catch (error) {
  return res.status(500).json({ success: false, error: error })
}
})

module.exports = router;
