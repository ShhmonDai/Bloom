const listsContainer2 = document.querySelector('[data-lists2]')
const newListForm2 = document.querySelector('[data-new-list-form2]')
const newListInput2 = document.querySelector('[data-new-list-input2]')
const deleteListButton2 = document.querySelector('[data-delete-list-button2]')
const listDisplayContainer2 = document.querySelector('[data-list-display-container2]')
const listTitleElement2 = document.querySelector('[data-list-title2]')
const listCountElement2 = document.querySelector('[data-list-count2]')
const tasksContainer2 = document.querySelector('[data-tasks2]')
const taskTemplate2 = document.getElementById('task-template2')
const newTaskForm2 = document.querySelector('[data-new-task-form2]')
const newTaskInput2 = document.querySelector('[data-new-task-input2]')
const clearCompleteTasksButton2 = document.querySelector('[data-clear-complete-tasks-button2]')

const LOCAL_STORAGE_LIST_KEY2 = 'task2.lists2'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY2 = 'task2.selectedListId2'
let lists2 = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY2)) || []
let selectedListId2 = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY2)

listsContainer2.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId2 = e.target.dataset.listId
        saveAndRenderTwo()
    }
})
//Clicking on task to complete
tasksContainer2.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists2.find(list => list.id === selectedListId2)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        
        
        if (selectedTask.complete === false) {
            document.getElementById("incBody").submit();
        }
        else { 
            document.getElementById("decBody").submit(); 
        }

        selectedTask.complete = e.target.checked;

        saveTwo()
        renderTaskCountTwo(selectedList)

    }
})

clearCompleteTasksButton2.addEventListener('click', e => {
    const selectedList = lists2.find(list => list.id === selectedListId2)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRenderTwo()
})

deleteListButton2.addEventListener('click', e => {
    lists2 = lists2.filter(list => list.id !== selectedListId2)
    selectedListId2 = null
    saveAndRenderTwo()
})

newListForm2.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput2.value
    if (listName == null || listName === '') return
    const list = createListTwo(listName)
    newListInput2.value = null
    lists2.push(list)
    saveAndRenderTwo()
})

newTaskForm2.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput2.value
    if (taskName == null || taskName === '') return
    const task = createTaskTwo(taskName)
    newTaskInput2.value = null
    const selectedList = lists2.find(list => list.id === selectedListId2)
    selectedList.tasks.push(task)
    saveAndRenderTwo()
})

function createListTwo(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function createTaskTwo(name) {
    return { id: Date.now().toString(), name: name, complete: false }
}

function saveAndRenderTwo() {
    saveTwo()
    renderTwo()
}

function saveTwo() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY2, JSON.stringify(lists2))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY2, selectedListId2)
}

function renderTwo() {
    clearElementTwo(listsContainer2)
    renderListsTwo()

    const selectedList = lists2.find(list => list.id === selectedListId2)
    if (selectedListId2 == null) {
        listDisplayContainer2.style.display = 'none'
    } else {
        listDisplayContainer2.style.display = ''
        listTitleElement2.innerText = selectedList.name
        renderTaskCountTwo(selectedList)
        clearElementTwo(tasksContainer2)
        renderTasksTwo(selectedList)
    }
}

function renderTasksTwo(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate2.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer2.appendChild(taskElement)
    })
}

function renderTaskCountTwo(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement2.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderListsTwo() {
    lists2.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if (list.id === selectedListId2) {
            listElement.classList.add('active-list')
        }
        listsContainer2.appendChild(listElement)
    })
}

function clearElementTwo(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

renderTwo()