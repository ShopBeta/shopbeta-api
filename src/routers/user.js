const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const { User } = require('../models/user')
const auth = require('../middleware/auth')
// const { sendWelcomeEmail } = require('../emails/account')
const router = new express.Router()


router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)

    try {

        await user.save()
        // sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.token = req.user.token.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.token = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/fetchme', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users', async (req, res) => {
    try {
        const user = await User.find({})
        res.send(user.reverse())
    } catch (e) {
        res.status(500).send(e)
    }
 })

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    
    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/update/:id', async (req, res) => {
    const _id = req.params.id

    const user = await User.findById(_id)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'email', 'password', 'bio', 'phonenumber', 'location', 'website', 'contactEmail']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/deleteme', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// Upload profile photo
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/:id/avatar', upload.single('avatar'), async (req, res) => {
    const _id = req.params.id
    const user = await User.findById(_id)

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    user.avatar = buffer
    await user.save()
    res.redirect('https://shopbeta-online.onrender.com/assets/vendor/Profile')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.delete('users/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ 
        success: true, 
        message: `Deleted a count of ${user.deletedCount} user.` 
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  })

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


// Follow a user
router.post('/user/:userId/follow/:id', async (req, res) => {
   
    const userModel = User.findById(req.params.userId)
    const userMe = User.getUserById(req.params.id)

    try {
        const user = await userModel
        const me = await userMe
       
        if (!user || !me) {
            return res.status(404).send()
        }
        
        me.following.push(req.params.userId)
        user.followers.push(req.params.id)
        await user.save()
        await me.save()
        res.status(200).send(me)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/:id/followers', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.followers) {
            throw new Error()
        }

        res.send(user.followers)
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/users/:id/following', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.following) {
            throw new Error()
        }

        res.send(user.following)
    } catch (e) {
        res.status(404).send()
    }
})

router.post('/user/:userId/unfollow/:id', async (req, res) => {

    const userModel = User.findById(req.params.userId)
    const userMe = User.getUserById(req.params.id)

    try {
        const user = await userModel
        const me = await userMe
       
        if (!user || !me) {
            return res.status(404).send()
        }
        
        me.following.splice(req.params.userId)
        user.followers.splice(req.params.id)
        await user.save()
        await me.save()
        res.status(201).send(me)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/:id/hearts', auth, async (req, res) => {
   
    const userModel = User.findById({
        ...req.body,
        _id: req.params.id,
    })

    try {
        const user = await userModel

        if (!user) {
            return res.status(404).send()
        }
        const updates = req.body.hearts
        user.hearts = updates
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router