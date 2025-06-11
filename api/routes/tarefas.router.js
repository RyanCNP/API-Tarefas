import express from 'express'
import {
    getCompletedTasks,
    getPendingTasks,
    getTasks,
    createTask,
    updateConcludeTask,
    updateTaskInformations,
    deleteTask
} from '../controllers/tarefas.controller'
import auth from '../middleware/auth'

const router = express.Router()

// Get All Tasks
router.get("/", auth, getTasks)

// Get Pending Tasks
router.get("/pendentes", auth, getPendingTasks)

// Get Completed Tasks
router.get("/concluidas", auth, getCompletedTasks)

// Create New Task
router.post("/", auth, createTask)

// Update Task Informations
router.put("/:id", auth, updateTaskInformations)

// Conclude Task
router.put("/concluir/:id", auth, updateConcludeTask)

// Delete Task
router.delete("/:id", auth, deleteTask)

export default router