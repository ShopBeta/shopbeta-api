const express = require('express')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const sharp = require('sharp')
const { User } = require('../models/user')
const auth = require('../middleware/auth')
const { resetPasswordEmail, WelcomeEmail, CancelationEmail, passwordSuccessEmail } = require('../emails/account')
const router = new express.Router()

// register new user
router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)
    const email = req.body.email;

    try {
        
        // check if user with email already exist
        const check = await User.findOne({ email })

        if (check) {
          return res.status(403).json({
            status: "fail",
            message: "User with email already exist"
          })
        }

        await user.save()
        //WelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        await user.generateAvatar()
        res.status(201).send({ user, token })
        
    } catch (error) {
        res.status(400).json({ success: false, error: error })
    }
})

// login user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

          if (!user) {
            return res.status(400).json({
              status: "fail",
              message: "User is not registered"
            })
          }

        res.send({ user, token })
    } catch (e) {
        res.status(400).json({ success: false, message: "Unable to login, try again!" })
    }
})

// logout user
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

// logout user from every devices logged in from 
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.token = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/forgotPassword', async (req, res) => {

    try {
        const { email } = req.body
        const user = await User.findOne({email})  
          
        if (!user) {
            return res.status(404).send("There is no user with this email")
        }
          
        await user.save()
        res.status(200).send(user)
                
        // resetPasswordEmail(user.email)
        
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/resetPassword/:id', async (req, res) => {
    try {
  
        const { password } = req.body
        const _id = req.params.id
          
        const user = await User.findOne({ _id })
          
        if (!user) {
            return res.send(500).send("User does not exist")
        }
          
        // const hashedPassword = await bcrypt.hash(password, 12)
          
        user.password = password
        console.log(user.password)
        user.save()

        // passwordSuccessEmail(user.email, user.name)
          
        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully!!!'
        })

    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/changePassword/:id', async (req, res) => {
    try {
  
        const { newPassword, oldPassword } = req.body
        const _id = request.params.id

        const user = await User.findOne({ _id })
        console.log(_id)
    
        if (!user) {
            return res.status(500).send("User does not exist")
        }
    
        const correctPassword = await bcrypt.compare(oldPassword, user.password)
    
        if (!correctPassword) {
            return res.status(400).send("Old password is incorrect, try again!")
        }
    
        // const hashedPassword = await bcrypt.hash(newPassword, 12)

        user.password = newPassword
        user.save()
    
        res.status(200).json({
        status: "success",
        message: "Password updated successfully!"
        })

    } catch (e) {
        res.status(500).send(`Couldn't update new password!`)
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
    const allowedUpdates = ['username', 'email', 'bio', 'phonenumber', 'location', 'link']
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
    res.redirect('https://shopbeta-online.onrender.com/assets/Adbillboard')
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
        console.log(me)
        res.status(200).send(me)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/:id/followers', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user.followers)
    } catch (e) {
        res.status(404).send()
    }
})

router.get('/users/:id/following', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user.following)
    } catch (e) {
        res.status(400).send()
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
   
    const userModel = User.findById(req.params.id)

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