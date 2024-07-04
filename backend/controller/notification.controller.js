const Notification = require("../models/notification.model");

const getNotification = async(req, res) =>{
          try {
                    const userId= req.user._id;

                    const notification= await Notification.find({to: userId}).populate({
                              path: 'from',
                              select: "username profilePicture"
                    })

                    await Notification.updateMany({to: userId}, {read: true});

                    res.status(200).json(notification);

          } catch (error) {
                 console.log(error.message);
                 res.status(500).json({message: error.message});   
          }
}

const deleteNotification = async(req, res) =>{
          try {
                    const userId = req.user._id;

                    await Notification.deleteMany({to: userId});

                    res.status(200).json({message: "Notification deleted successfully"});

          } catch (error) {
                    console.log(error.message);
                    res.status(500).json({message: error.message});
          }
}

module.exports = {getNotification, deleteNotification};