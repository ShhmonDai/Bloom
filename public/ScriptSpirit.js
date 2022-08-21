const listsContainer3 = document.querySelector('[data-lists3]')
const newListForm3 = document.querySelector('[data-new-list-form3]')
const newListInput3 = document.querySelector('[data-new-list-input3]')
const deleteListButton3 = document.querySelector('[data-delete-list-button3]')
const listDisplayContainer3 = document.querySelector('[data-list-display-container3]')
const listTitleElement3 = document.querySelector('[data-list-title3]')
const listCountElement3 = document.querySelector('[data-list-count3]')
const tasksContainer3 = document.querySelector('[data-tasks3]')
const taskTemplate3 = document.getElementById('task-template3')
const newTaskForm3 = document.querySelector('[data-new-task-form3]')
const newTaskInput3 = document.querySelector('[data-new-task-input3]')
const clearCompleteTasksButton3 = document.querySelector('[data-clear-complete-tasks-button3]')

const LOCAL_STORAGE_LIST_KEY3 = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY3 = 'task.selectedListId'
let lists3 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY3)) || []
let selectedListId3 = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY3)

listsContainer3.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId3 = e.target.dataset.listId
        saveAndRender()
    }
})
//Clicking on task to complete
tasksContainer3.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists3.find(list => list.id === selectedListId3)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        
        if (selectedTask.complete === false) {
            document.getElementById("incSpirit").submit();
        }
        else {
            document.getElementById("decSpirit").submit();
        }
        
        selectedTask.complete = e.target.checked
        saveThree()
        renderTaskCount(selectedList)
    }
})

clearCompleteTasksButton3.addEventListener('click', e => {
    const selectedList = lists3.find(list => list.id === selectedListId3)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

deleteListButton3.addEventListener('click', e => {
    lists3 = lists3.filter(list => list.id !== selectedListId3)
    selectedListId3 = null
    saveAndRender()
})

newListForm3.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput3.value
    if (listName == null || listName === '') return
    const list = createList(listName)
    newListInput3.value = null
    lists3.push(list)
    saveAndRender()
})

newTaskForm3.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput3.value
    if (taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput3.value = null
    const selectedList = lists3.find(list => list.id === selectedListId3)
    selectedList.tasks.push(task)
    saveAndRender()
})

function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRender() {
    saveThree()
    render()
}

function saveThree() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY3, JSON.stringify(lists3))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY3, selectedListId3)
}

function render() {
    clearElement(listsContainer3)
    renderLists()

    const selectedList = lists3.find(list => list.id === selectedListId3)
    if (selectedListId3 == null) {
        listDisplayContainer3.style.display = 'none'
    } else {
        listDisplayContainer3.style.display = ''
        listTitleElement3.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksContainer3)
        renderTasks(selectedList)
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate3.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer3.appendChild(taskElement)
    })
}

function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement3.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists() {
    lists3.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if (list.id === selectedListId3) {
            listElement.classList.add('active-list')
        }
        listsContainer3.appendChild(listElement)
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render()