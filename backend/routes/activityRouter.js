const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLogmodel");

module.exports = (app) => {
  const io = app.get("io");

  if (!io) {
    console.error("Socket.io instance not found in app");
    return router;
  }
  io.on("connection", (socket) => {
    console.log("A user connected to activity log");
    socket.on("disconnect", () => {
      console.log("A user disconnected from activity log");
    });
  });
  const emitNewlog = async (logId) => {
    try {
      const log = await ActivityLog.findById(LogId)
        .populate("userId")
        .select("-password");
      io.emit("newActivityLog", log);
    } catch (error) {
      console.error("Error emitting new activity log:", error);
    }
  };

    router.post("/addLog", async (req, res) => {
        try {
            const newLog = new ActivityLog(req.body);
            const savedLog = await newLog.save();
            emitNewlog(savedLog._id);
            res.status(201).json(savedLog);
        } catch (error) {
            console.error("Error adding activity log:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

      router.delete('/deleteLog', async (req, res) => {
    try {
      const { id } = req.body;
      const deletedLog = await ActivityLog.findByIdAndDelete(id);

      if (!deletedLog) {
        return res.status(404).json({ message: "Log not found" });
      }

      res.status(200).json({ message: "Log deleted successfully", deletedLog });
    } catch (error) {
      console.error("Failed to delete log:", error);
      res.status(500).json({ message: "Failed to delete log", error: error.message });
    }
  });

    router.get("/getrecentActivitys",async(req,res)=>{
    try{
      const logs=await ActivityLog.find().sort({createdAt: -1}).limit(3);
      res.status(200).json(logs);
    }
    catch(error){
      console.error("Failed to fetch logs:", error);
      res.status(500).json({ message: "Failed to fetch logs", error: error.message });
    
    }
  });

    router.get('/getAllLogs', async (req, res) => {
    try {
      const logs = await ActivityLog.find().populate("userId");
      res.status(200).json(logs);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      res.status(500).json({ message: "Failed to fetch logs", error: error.message });
    }
  });

    return router;
    
};
