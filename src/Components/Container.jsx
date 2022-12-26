import React, { useContext, useEffect, useState } from 'react'
import "./Container.css"
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import axios from "../api/axios"
import { useNavigate } from 'react-router';
import AuthContext from '../context/AuthProvider';
import Loading from './Loading/Loading';

function Container() {
    const [Todo, setTodo] = useState({
        userID: localStorage.getItem("_id"),
        Name: '',
        Description: '',
        Deadline: new Date().toISOString().slice(0, 10),
    })
    const headers = {
        "token": localStorage.getItem('token')
    }

    const [List, setList] = useState([])
    const [AllList, setAllList] = useState([])
    const [pendingUpdate, setpendingUpdate] = useState(false) // to switch button
    const [Status, setStatus] = useState('all')
    const { setAuth } = useContext(AuthContext)
    const [isLoading, setisLoading] = useState(false)
    let navigate = useNavigate();

    const onAddNew = async (e) => {
        e.preventDefault()
        if (Todo.Name === '') return;


        setTodo({
            userID: localStorage.getItem("_id"),
            Name: '',
            Description: '',
            Deadline: new Date().toISOString().slice(0, 10),
        })

        document.getElementById('name').value = ''
        document.getElementById('descriptipn').value = ''
        document.getElementById('date').value = ''

        try {
            setisLoading(true);
            const res = await axios.post("/todo", Todo, { headers })
            if (res.status) {
                setisLoading(false)
                setAllList(pre => [...pre, res.data])
                setList(([
                    ...List,
                    res.data
                ]))
            }
        } catch (error) {
            localStorage.removeItem("token")
            setAuth({})
            navigate("/login", { replace: true });
            console.log(error);
        }
    }

    const onComplete = async (e, toDoId) => {
        e.preventDefault()
        try {
            const newList = List.map(obj => {
                if (obj._id === toDoId) {
                    return {
                        ...obj,
                        Status: "done"
                    }
                }
                return obj
            })

            const updatedItem = await newList.find(item => item._id = toDoId)
            setisLoading(true);
            const res = await axios.put("/todo", updatedItem, { headers })
            if (res.status) {
                setisLoading(false)
                setList(newList)
                setAllList(newList)
            }
        } catch (error) {
            localStorage.removeItem("token")
            setAuth({})
            navigate("/login", { replace: true });
            console.log(error);
        }
    }

    const onDelete = async (e, item) => {
        e.preventDefault()
        try {
            const toDoId = await item._id
            const newList = await List.filter(obj => obj._id !== toDoId)
            setisLoading(true);
            const res = await axios.delete(`/todo/${toDoId}`, { headers })
            if (res.status) {
                setisLoading(false)
                setAllList(newList)
                setList(newList)
            }
        } catch (error) {
            localStorage.removeItem("token")
            setAuth({})
            navigate("/login", { replace: true });
            console.log(error);
        }
    }

    const onLogout = async () => {
        try {
            await axios.delete("/user/logout", { headers })
            localStorage.removeItem('token')
            localStorage.removeItem('_id')
            navigate("/login", { replace: true });
        } catch (error) {
            console.log(error);
        }
    }

    const onUpdate = (e, item) => {
        e.preventDefault()
        setpendingUpdate(true)
        document.getElementById('name').value = item.Name
        document.getElementById('descriptipn').value = item.Description
        document.getElementById('date').value = new Date(item.Deadline).toISOString().substring(0, 10)

        setTodo({
            userID: localStorage.getItem("_id"),
            Name: document.getElementById('name').value,
            Description: document.getElementById('descriptipn').value,
            Deadline: document.getElementById('date').value,
            Status: item.Status,
            _id: item._id
        })
    }

    const updateSubmit = async (e) => {
        e.preventDefault()
        try {
            setisLoading(true)
            const res = await axios.put("/todo", Todo, { headers })
            if (res.status) {
                setisLoading(false)
            }
            let updatedList = List
            for (let index = 0; index < updatedList.length; index++) {
                if (updatedList[index]._id === Todo._id) {
                    updatedList[index] = Todo
                    break
                }
            }
            setList(() => ([
                ...updatedList
            ]))

            setAllList(() => ([
                ...updatedList


            ]))
            setTodo({
                userID: localStorage.getItem("_id"),
                Name: '',
                Description: '',
                Deadline: new Date().toISOString().slice(0, 10),
            })

            setpendingUpdate(false)
            // document.getElementById('name').value = ''
            // document.getElementById('descriptipn').value = ''
            // document.getElementById('date').value = ''
        } catch (error) {
            localStorage.removeItem("token")
            setAuth({})
            navigate("/login", { replace: true });
        }
    }

    const sortByStatus = (e, status) => {
        e.preventDefault()
        setStatus(status)
        let sortList = AllList;

        if (status !== 'all') {
            sortList = AllList.filter(item => item.Status === status)
        }

        setList(sortList)
    }

    const sortByDate = (e) => {
        e.preventDefault()
        let sortList = AllList;
        if (e.target.value) {
            sortList = AllList.filter(item => new Date(item.Deadline).toISOString().substring(0, 10) === e.target.value)
        }

        if (Status !== 'all') {
            sortList = sortList.filter(item => item.Status === Status)
        }
        setList(sortList)
    }

    useEffect(() => {
        const getTodos = async () => {
            try {
                setisLoading(true)
                const res = await axios.get(`/todo`, { headers })
                if (res.status) {
                    setisLoading(false)
                    res && setList(res.data)
                    res && setAllList(res.data)
                }
            } catch (error) {
                localStorage.removeItem("token")
                setAuth({})
                navigate("/login", { replace: true });
                console.log(error);
            }
        }
        getTodos()
    }, [])

    if (isLoading) {
        return (<Loading />)
    }

    return (
        <>
            <div className='header'>
                <h1>My todos</h1>
                <div className='header_icons' onClick={() => onLogout()}>
                    logout
                </div>
            </div>
            <div className='container'>
                <div className='addNewTodos'>
                    <form className='addNewTodos_form'>
                        <div className='addNewTodos_box'>
                            <label htmlFor="name">Name</label>
                            <input id='name' type='text'
                                name='name'
                                onChange={(e) => {
                                    setTodo({
                                        ...Todo,
                                        Name: e.target.value
                                    })
                                }} />
                        </div>

                        <div className='addNewTodos_box'>
                            <label htmlFor="descriptipn">Description</label>
                            <input id='descriptipn'
                                name='descriptipn'
                                type='text' onChange={(e) => {
                                    setTodo({
                                        ...Todo,
                                        Description: e.target.value
                                    })
                                }} />
                        </div>

                        <div className='addNewTodos_box'>
                            <label htmlFor="date">Date</label>
                            <input id='date'
                                name='date'
                                type='date' value={Todo.Deadline} onChange={(e) => {
                                    setTodo({
                                        ...Todo,
                                        Deadline: e.target.value
                                    })
                                }} />
                        </div>

                        <div className='addNewTodos_box submit_box'>
                            {pendingUpdate !== true ? <button type='submit' className='button' onClick={(e) => {
                                onAddNew(e)
                            }}>
                                Add Todos
                            </button> : <button type='submit' className='button' onClick={(e) => {
                                updateSubmit(e)
                            }}>
                                Update Todos
                            </button>}

                        </div>
                    </form>
                </div>

                <div className='sortTodos' >
                    <form className='sortTodos_form'>
                        <button className={Status === 'all' ? 'sortTodos_button button button_click' : 'sortTodos_button button'}
                            onClick={(e) => sortByStatus(e, 'all')}
                        >
                            All
                        </button>

                        <button className={Status === 'done' ? 'sortTodos_button button button_click' : 'sortTodos_button button'}
                            onClick={(e) => sortByStatus(e, 'done')}
                        >
                            Done
                        </button>

                        <button className={Status === 'todo' ? 'sortTodos_button button button_click' : 'sortTodos_button button'}
                            onClick={(e) => sortByStatus(e, 'todo')}
                        >
                            Todo
                        </button>

                        <input className='sortTodos_button button'
                            name='date_sort'
                            type='date' onChange={(e) => sortByDate(e)} />
                    </form>
                </div>

                <div className='todosList'>
                    {
                        List && List.length > 0 ? List.map((item, index) => (
                            <div className={item.Status === 'done' ? "todosList_item done" : "todosList_item"} key={index}>
                                <div className='todosList_item_content' >
                                    <h2 className='todosList_item_content_title'> {item.Name} </h2>
                                    <p className='todosList_item_content_todos'> {item.Description} </p>
                                </div>

                                <div className='todosList_item_date' >
                                    <h2 className='todosList_item_date_date'>Deadline: {new Date(item.Deadline).toLocaleDateString()} </h2>
                                </div>

                                <div className='todosList_item_action' >
                                    <button className='action_button button update'
                                        onClick={(e) => {
                                            onUpdate(e, item)
                                        }}
                                    >
                                        <AiOutlineEdit />
                                    </button>

                                    <button className='action_button button complete'
                                        onClick={(e) => {
                                            onComplete(e, item._id)
                                        }}
                                    >
                                        <AiOutlineCheck />
                                    </button>

                                    <button className='action_button button delete'
                                        onClick={(e) => {
                                            onDelete(e, item)
                                        }}
                                    >
                                        <AiOutlineClose />
                                    </button>
                                </div>
                            </div>
                        )) : undefined
                    }
                </div>

            </div>
        </>
    )
}

export default Container