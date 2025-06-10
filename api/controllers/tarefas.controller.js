import { ObjectID } from "mongodb";

export const getCompletedTasks = async (req, res) => {
    try {
        const db = req.app.locals.db
        const tarefas = await db.collection('tarefas').find({ concluida: true }).toArray()
        //Caso encontre uma ou mais tarefas
        if (tarefas) return res.status(200).json(tarefas)
        //Caso nenhuma tarefa seja encontrada
        else return res.status(200).json({ message: "Nenhuma tarefa concluida" })
    } catch (err) {
        console.error("Erro ao conectar com o servidor:", err)
        return res.status(500).json({
            error: true,
            message: "Erro ao conectar com o servidor",
        })
    }
}

export const getPendingTasks = async (req, res) => {
    try {
        const db = req.app.locals.db
        const tarefas = await db.collection('tarefas').find({ concluida: false }).toArray()
        //Caso encontre uma ou mais tarefas
        if (tarefas) return res.status(200).json(tarefas)
        //Caso nenhuma tarefa seja encontrada
        else return res.status(200).json({ message: "Nenhuma tarefa pendente" })
    } catch (err) {
        console.error("Erro ao conectar com o servidor:", err)
        return res.status(500).json({
            error: true,
            message: "Erro ao conectar com o servidor",
        })
    }
}

export const getTasks = async (req, res) => {
    try {
        const db = req.app.locals.db
        const tarefas = await db.collection('tarefas').find().toArray()
        //Caso encontre uma ou mais tarefas
        if (tarefas) return res.status(200).json(tarefas)
        //Caso nenhuma tarefa seja encontrada
        else return res.status(404).json({ message: "Nenhuma tarefa encontrada" })
    } catch (err) {
        console.error("Erro ao conectar com o servidor:", err)
        return res.status(500).json({
            error: true,
            message: "Erro ao conectar com o servidor",
        })
    }
}

export const getTaskStatus = async (req, res) => {
    try {
        const db = req.app.locals.db
        const tarefas = await db.collection('tarefas').find().toArray()
        //Caso o usuário tenha poucas tarefas pendentes
        if (tarefas.length > 0) return res.status(200).json({ message: `${tarefas.length} tarefas pendentes` })
        //Caso o usuário tenha muitas tarefas pendentes
        if (tarefas.length > 10) return res.status(200).json({ message: `Mais de ${tarefas.length} tarefas pendentes, cuidado!` })
        //Caso o usuário tenha poucas tarefas pendentes
        return res.status(200).json({ message: "Nenhuma tarefa pendente" })
    } catch (err) {
        console.error("Erro ao conectar com o servidor:", err)
        return res.status(500).json({
            error: true,
            message: "Erro ao conectar com o servidor",
        })
    }
}

export const postTask = async (req, res) => {
    try {
        const db = req.app.locals.db
        const { titulo, descricao } = req.body

        const existTask = await db.collection('tarefas').findOne({ titulo })
        if (existTask) return res.status(409).json({ message: "Está tarefa já esta registrada!" })

        const newTask = {
            id: new ObjectID(),
            titulo,
            descricao,
            concluida: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            user_id: req.user.id
        }

        const result = await db.collection('tarefas').insertOne(newTask)
        return res.status(201).json({
            _id: result.insertedId,
            ...newTask, message: "Tarefa criada com sucesso!"
        })
    } catch (err) {
        console.error("Erro ao conectar com o servidor:", err)
        return res.status(500).json({
            error: true,
            message: "Erro ao conectar com o servidor",
        })
    }
}

export const putConcludeTask = async (req, res) => {
    try {
        const db = req.app.locals.db
        const { id } = req.params
        const { concluida } = req.body
        const updatedAt = new Date()

        //Caso a tarefa seja concluida
        if (concluida) {
            const result = await db.collection('tarefas').updateOne({ id }, { $set: { concluida, updatedAt } })
            if (result) return res.status(200).json({ message: "Tarefa concluida com sucesso!" })
        }
        //Caso a tarefa seja desfeita
        else {
            const result = await db.collection('tarefas').updateOne({ id }, { $set: { concluida, updatedAt } })
            if (result) return res.status(200).json({ message: "Tarefa desfeita com sucesso!" })
        }
    } catch (err) {
        console.error("Erro ao conectar com o servidor:", err)
        return res.status(500).json({
            error: true,
            message: "Erro ao conectar com o servidor",
        })
    }
}

export const putTaskInformation = async (req, res) => {
    try {
        const db = req.app.locals.db
        const { id } = req.params
        const { titulo, descricao } = req.body
        const updatedAt = new Date()

        const result = await db.collection('tarefas').updateOne({ id }, { $set: { titulo, descricao, updatedAt } })
        if (result) return res.status(200).json({ message: "Tarefa atualizada com sucesso!" })
    } catch (err) {
        console.error("Erro ao conectar com o servidor:", err)
        return res.status(500).json({
            error: true,
            message: "Erro ao conectar com o servidor",
        })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const db = req.app.locals.db
        const { id } = req.params

        const existTask = await db.collection('tarefas').findOne({ id })
        if (!existTask) return res.status(409).json({ message: "Tarefa não encontrada!" })

        const result = await db.collection('tarefas').deleteOne({ id })
        if (result) return res.status(200).json({ message: "Tarefa excluida com sucesso!" })
    } catch (err) {
        console.error("Erro ao conectar com o servidor:", err)
        return res.status(500).json({
            error: true,
            message: "Erro ao conectar com o servidor",
        })
    }
}