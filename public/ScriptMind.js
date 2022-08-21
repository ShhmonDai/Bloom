const listsContainer1 = document.querySelector('[data-lists1]')
const newListForm1 = document.querySelector('[data-new-list-form1]')
const newListInput1 = document.querySelector('[data-new-list-input1]')
const deleteListButton1 = document.querySelector('[data-delete-list-button1]')
const listDisplayContainer1 = document.querySelector('[data-list-display-container1]')
const listTitleElement1 = document.querySelector('[data-list-title1]')
const listCountElement1 = document.querySelector('[data-list-count1]')
const tasksContainer1 = document.querySelector('[data-tasks1]')
const taskTemplate1 = document.getElementById('task-template1')
const newTaskForm1 = document.querySelector('[data-new-task-form1]')
const newTaskInput1 = document.querySelector('[data-new-task-input1]')
const clearCompleteTasksButton1 = document.querySelector('[data-clear-complete-tasks-button1]')

const LOCAL_STORAGE_LIST_KEY1 = 'task1.lists1'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY1 = 'task1.selectedListId1'
let lists1 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY1)) || []
let selectedListId1 = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY1)

listsContainer1.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId1 = e.target.dataset.listId
        saveAndRenderOne()
    }
})
//Clicking on task to complete
tasksContainer1.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists1.find(list => list.id === selectedListId1)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        
        if (selectedTask.complete === false) {
            document.getElementById("incMind").submit();
        }
        else {
            document.getElementById("decMind").submit();
        }
        
        selectedTask.complete = e.target.checked
        saveOne()
        renderTaskCountOne(selectedList)
    }
})

clearCompleteTasksButton1.addEventListener('click', e => {
    const selectedList = lists1.find(list => list.id === selectedListId1)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRenderOne()
})

deleteListButton1.addEventListener('click', e => {
    lists1 = lists1.filter(list => list.id !== selectedListId1)
    selectedListId1 = null
    saveAndRenderOne()
})

newListForm1.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput1.value
    if (listName == null || listName === '') return
    const list = createList(listName)
    newListInput1.value = null
    lists1.push(list)
    saveAndRenderOne()
})

newTaskForm1.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput1.value
    if (taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput1.value = null
    const selectedList = lists1.find(list => list.id === selectedListId1)
    selectedList.tasks.push(task)
    saveAndRenderOne()
})

function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRenderOne() {
    saveOne()
    renderOne()
}

function saveOne() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY1, JSON.stringify(lists1))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY1, selectedListId1)
}

function renderOne() {
    clearElementOne(listsContainer1)
    renderListsOne()

    const selectedList = lists1.find(list => list.id === selectedListId1)
    if (selectedListId1 == null) {
        listDisplayContainer1.style.display = 'none'
    } else {
        listDisplayContainer1.style.display = ''
        listTitleElement1.innerText = selectedList.name
        renderTaskCountOne(selectedList)
        clearElementOne(tasksContainer1)
        renderTasksOne(selectedList)
    }
}

function renderTasksOne(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate1.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer1.appendChild(taskElement)
    })
}

function renderTaskCountOne(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement1.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderListsOne() {
    lists1.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if (list.id === selectedListId1) {
            listElement.classList.add('active-list')
        }
        listsContainer1.appendChild(listElement)
    })
}

function clearElementOne(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

renderOne()