const request = require('supertest')
const app = require('../app')
const Feed = require('../models/feed')
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    feedOne,
    feedTwo,
    feedThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create feed for user', async () => {
    const response = await request(app)
        .post('/feed')
        .set('Authorization', `Bearer ${userOne.token[0].token}`)
        .send({
            text: 'Jordan Nike is so amazing!!!',
            media: 'tests/fixtures/profile-pic.jpg',
        })
        .expect(201)
    const feed = await Feed.findById(response.body._id)
    expect(feed).not.toBeNull()
    expect(feed.media).toEqual(expect.any(Buffer))
})

test('Should fetch user feeds', async () => {
    const response = await request(app)
        .get('/feed')
        .set('Authorization', `Bearer ${userOne.token[0].token}`)
        .send()
        .expect(200)
})

test('Should update feed for user', async () => {
    const response = await request(app)
        .post(`/feed/${feedOne._id}/comments`)
        .set('Authorization', `Bearer ${userOne.token[0].token}`)
        .send({
            comments: [{
                text: 'Jordan Nike is so amazing!!',
                file: 'tests/fixtures/profile-pic.jpg'
            }],
        })
        .expect(201)
    const feed = await Feed.findById(feedOne._id)
    expect(feed.comments[0].file).toEqual(expect.any(Buffer))
})
