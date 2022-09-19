const express = require('express')
const Feed = require('../models/feed')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()

 // Upload profile media file for a feed
 const upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/)) {
            return cb(new Error('Please upload a supported file format'))
        }

        cb(undefined, true)
    }
})

router.post('/feed', auth, upload.single('media'), async (req, res) => {
    const feed = new Feed({
        ...req.body,
        owner: req.user._id
    })

    try {
        feed.media = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        await feed.save()
        res.status(201).send(feed)
    } catch (e) {
        res.status(400).send(e)
    }
    
 }, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

 router.get('/feed', auth, async (req, res) => {
    try {
        const feed = await Feed.find({})
        res.send(feed)
    } catch (e) {
        res.status(500).send(e)
    }
 })

 // GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/feed', auth, async (req, res) => {
    const match = {}

    if (req.query.user.follow) {
        match.follow = req.query.user.follow === 'true'
    }

    try {
        await req.feed.populate({
            path: 'feed',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
            }
        }).execPopulate()
        res.send(req.feed)
    } catch (e) {
        res.status(500).send()
    }
})


 router.get('/feed/:id', auth, async (req, res) => {
     const _id = req.params.id

     try {
         const feed = await Feed.findById(_id)

         if (!feed) {
             return res.status(404).send()
         }

         res.send(feed)
     } catch (e) {
        res.status(500).send()
     }

 })

router.delete('/feed/:id', auth, async (req, res) => {
    try {
        const feed = await Feed.findByIdAndDelete(req.params.id)

        if (!feed) {
            res.status(404).send()
        }

        res.send(feed)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Upload media file as a comment
const upload2 = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/)) {
            return cb(new Error('Please upload a supported file format'))
        }

        cb(undefined, true)
    }
})


// POST comments
router.post('/feed/:id/comments', auth, upload2.single('file'), async (req, res) => {
   
    const feedModel = Feed.findById({
        ...req.body,
        _id: req.params.id,
    })

    try {
        const feed = await feedModel

        if (!feed) {
            return res.status(404).send()
        }
        const updates = req.body.comments[0]
        // feed.comments[0].file = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()  
        // feed.comments.push(feed.comments[0])
        feed.comments.push(updates)
        await feed.save()
        res.status(201).send(feed)
    } catch (e) {
        res.status(400).send(e)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.get('/feed/:id/comments', async (req, res) => {
    try {
        const feed = await Feed.findById(req.params.id)

        if (!feed || !feed.comments) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(feed.comments)
    } catch (e) {
        res.status(404).send()
    }
})

// POST hearts
router.post('/feed/:id/hearts', auth, async (req, res) => {
   
    const feedModel = Feed.findById({
        ...req.body,
        _id: req.params.id,
    })

    try {
        const feed = await feedModel

        if (!feed) {
            return res.status(404).send()
        }
        const updates = req.body.hearts
        feed.hearts = updates
        await feed.save()
        res.status(201).send(feed)
    } catch (e) {
        res.status(400).send(e)
    }
})

 
module.exports = router