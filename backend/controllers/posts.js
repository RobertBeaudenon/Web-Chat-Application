const Joi = require('@hapi/joi'); //Will help us validate the data that we are getting from the frontend before sending it to the db
const HttpStatus = require('http-status-codes'); //instead of writing 200 we wirte HttpStatus.GOOD_REQUEST

const Post = require('../models/postModels');
const User = require('../models/userModels');
module.exports = {
  /****  Add a POST  ****/
  AddPost(req, res) {
    //Joi validation on input
    const schema = Joi.object({
      post: Joi.string().required() //must be a string,shouldn't be empty
    });
    const { error, value } = schema.validate(req.body);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }

    //Create new structure of object that will be inserted in DB
    const newBody = {
      //remember that in our request we always pass the 'user' object that contains the details
      user: req.user._id,
      username: req.user.username,
      post: req.body.post,
      created: new Date()
    };

    //We use the mongoose build in method to insert the post in the DB
    Post.create(newBody)
      .then(async post => {
        //When we create a new post we get the user related to that post and add that post to the array of posts related to that user, (update is form mongoose)

        await User.update(
          {
            _id: req.user._id
          },
          {
            $push: {
              posts: {
                postId: post._id,
                post: req.body.post,
                created: new Date()
              }
            }
          }
        );
        res.status(HttpStatus.OK).json({ message: 'Post created', post });
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured fromhere' });
      });
  },

  /****Get all the POSTS *******/
  //Async/Await is a way of working with promises. Instead of using callbacks, async/await lets you use then and catch methods
  async GetAllPosts(req, res) {
    try {
      const posts = await Post.find({}) //get all posts by passing an empty object //i think 'user' in populate is the user object passed in requests
        .populate('user') //If you go to the post model file in your project, you'll see that we added a property with name user and its type is mongoose schema ObjectId and a reference is set to 'User'.  The populate method is coming from mongoose and it lets you make reference to documents in other collections. So when we call the populate method and then pass in the user whose type is an ObjectId and ref is 'User" collection, the method will go to the User collection and then look for the document whose id matches the ObjectId. If it finds it, the document properties will be returned. 9http://mongoosejs.com/docs/populate.html
        .sort({ created: -1 }); //in decending order from latest to oldest

      return res.status(HttpStatus.OK).json({ message: 'All posts', posts });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error occured while populating posts', posts });
    }
  },

  /**** Like a Post *******/
  async AddLike(req, res) {
    const postId = req.body._id;
    await Post.update(
      {
        _id: postId, //we find the post by the id
        'likes.username': { $ne: req.user.username } //verify that the user didn't already like the post, $ne stand for not equal, so we are searching in array of likes if username is not eqaul to the username of the user that is requesting to add a like
      },
      {
        $push: {
          likes: {
            username: req.user.username
          }
        },
        $inc: { totalLikes: 1 }
      }
    )
      .then(() => {
        res.status(HttpStatus.OK).json({ message: 'You liked a post' });
      })
      .catch(err =>
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured when liking the post' })
      );
  },

  /**** Comment a Post *******/
  AddComment(req, res) {
    // console.log(req.body);
    // const postId = req.body._id;
    // await Post.update(
    //   {
    //     _id: postId, //we find the post by the id
    //     'likes.username': { $ne: req.user.username } //verify that the user didn't already like the post, $ne stand for not equal, so we are searching in array of likes if username is not eqaul to the username of the user that is requesting to add a like
    //   },
    //   {
    //     $push: {
    //       likes: {
    //         username: req.user.username
    //       }
    //     },
    //     $inc: { totalLikes: 1 }
    //   }
    // )
    //   .then(() => {
    //     res.status(HttpStatus.Ok).json({ message: 'You liked a post' });
    //   })
    //   .catch(err =>
    //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured when liking the post' })
    //   );
  }
};
