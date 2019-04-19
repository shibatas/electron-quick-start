/*

Link to tutorial
https://codeburst.io/build-a-todo-app-with-electron-d6c61f58b55a

*/

'use strict'

const path = require('path')
const { app, ipcMain } = require('electron')

const Window = require('./Window')
const DataStore = require('./DataStore')

const todosData = new DataStore({ name: 'Todos Main' })

function main () {
  let mainWindow = new Window({
    file: path.join('renderer', 'index.html')
  })

  let addTodoWin

  mainWindow.once('show', () => {
    mainWindow.webContents.send('todos', todosData.todos)
  })

  ipcMain.on('add-todo-window', () => {
    if (!addTodoWin) {
      addTodoWin = new Window({
        file: path.join('renderer', 'add.html'),
        width: 400,
        height: 400,
        parent: mainWindow
      })

      addTodoWin.on('closed', () => {
        addTodoWin = null
      })
    }
  })


  ipcMain.on('add-todo', (event, todo) => {
    const updatedTodos = todosData.addTodo(todo).todos

    mainWindow.send('todos', updatedTodos)
  })

  ipcMain.on('delete-todo', (event, todo) => {
    const updatedTodos = todosData.deleteTodo(todo).todos
        
    mainWindow.send('todos', updatedTOdos)
  })
}

app.on('ready', main)

app.on('window-all-closed', function () {
  app.quit()
})