const express = require('express')
const uuid = require("uuid")

const port = 3000
const app = express()
app.use(express.json())


/*  
    -QUERY PARAMS => MEUSIT.COM/USERS?NOME=RODOLFO&AGE=28 // FILTROS
    -ROUTE PARAMS => /USERS/2     //BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECIFICO.
    -REQUEST BODY => {"name":"Rodolfo", "age": 33}
    -GET          => BUSCAR INFORMAÇÃO NO BACK-END
    -POST         => CRIAR INFORMAÇÃO NO BACK-END
    -PUT / PATCH  => ALTERAR/ ATUALIZAR INFORMAÇÃO NO BACK-END
    - DELETE      => DELETAR INFORMAÇÃO NO BACK-END
    -Middleware   => INTERCEPTADOR => TEM O PODER DE PARAR OU ALTERAR DADOS DA REQUISIÇÃO
    
*/
const orders = []

const checkId = (request, response, next) => {
    const {id} = request.params
    const index = orders.findIndex(user => user.id === id)

    if(index < 0){
        response.status(404).json({message: "user not found"})
    }
    
    request.userIndex = index
    request.userId = id

    next()
}
const requests = (request, response, next) =>{
    const method = request.route.methods
    const url = request.route.path
    console.log(method, url)

    next()
}


app.get('/orders', (request, response) =>{  
    return response.json(orders)
})

app.post('/orders', (request, response) =>{  
    const {order, clientName, price, status} = request.body

    const user = {id:uuid.v4(), order, clientName, price, status }

    orders.push(user)

    return response.status(201).json(user)

})

app.put('/orders/:id', checkId, requests, (request, response) =>{     
    const {order, clientName, price, status} = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = {id, order, clientName, price, status}
    orders[index] = updateUser
    return response.json(updateUser)
})

app.delete('/orders/:id',checkId, requests, (request, response) =>{  
    
    const index = request.userIndex
    orders.splice(index,1)
    return response.status(204).json()
})

app.patch('/orders/:id',checkId, requests, (request, response) =>{  

    const index = request.userIndex
        
    orders[index].status = "PRONTO"

    return response.json(orders[index])
})

app.get('/orders/:id',checkId, requests, (request, response) =>{
    const index = request.userIndex
    const id = request.userId

   
    return response.json(orders[index])
})
































app.listen(port, () =>{
    console.log(`🚀Server online ${port}`)
})