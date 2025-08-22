import React, { useState } from "react";
import './App.css';
function TodoApp() {
  const savedManualTodos = localStorage.getItem("manualTodos");
  const [manualTodos, setManualTodos] = useState(
  savedManualTodos ? JSON.parse(savedManualTodos) : []
  );
  const [apiTodos, setApiTodos] = useState([]); 
  const [task, setTask] = useState(""); 
  const [editId, setEditId] = useState(null); 
  const [editText, setEditText] = useState(""); 
  const [showApiTodos, setShowApiTodos] = useState(false); 
  const addTodo = () => {
    if (!task.trim()) return;
    const newTodos = [...manualTodos, { id: Date.now(), text: task }];
    setManualTodos(newTodos);
    localStorage.setItem("manualTodos", JSON.stringify(newTodos));
    setTask("");
  };
  const deleteManualTodo = (id) => {
    const newTodos = manualTodos.filter((todo) => todo.id !== id);
    setManualTodos(newTodos);
    localStorage.setItem("manualTodos", JSON.stringify(newTodos));
  };
  const saveEditManual = (id) => {
    if (!editText.trim()) return;
    const newTodos = manualTodos.map((todo) =>
      todo.id === id ? { ...todo, text: editText } : todo
    );
    setManualTodos(newTodos);
    localStorage.setItem("manualTodos", JSON.stringify(newTodos));
    setEditId(null);
    setEditText("");
  };
  const fetchTodos = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos?_limit=5"
    );
    const data = await response.json();
    const formatted = data.map((item) => ({ id: item.id, text: item.title }));
    setApiTodos(formatted);
    setShowApiTodos(true);
  };
  const goBack = () => {
    setApiTodos([]);
    setShowApiTodos(false);
  };
  return (
    <div className="app">
      <div className="header">
        <h1 className="title">✨ Todo App</h1>
      </div>
      <div className="controls">
        {!showApiTodos ? (
          <>
            <input
              className="input"
              type="text"
              placeholder="Add a task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button className="btn btn-primary" onClick={addTodo}>
              Add
            </button>
            <button className="btn btn-outline" onClick={fetchTodos}>
              Load Todos
            </button>
          </>
        ) : (
          <button className="btn btn-outline" onClick={goBack}>
            Back
          </button>
        )}
      </div>
      {manualTodos.length === 0 && (!showApiTodos || apiTodos.length === 0) ? (
        <div className="empty">No todos yet. Add one above or load from API!</div>
      ) : (
        <div>
          {showApiTodos && <h4 className="api-label">API Todos (Read-only)</h4>}
          <ul className="list">
            {showApiTodos &&
              apiTodos.map((todo) => (
                <li key={todo.id} className="item api-item">
                  <span className="item-title">{todo.text}</span>
                </li>
              ))}
            {!showApiTodos &&
              manualTodos.map((todo) => (
                <li key={todo.id} className="item manual-item">
                  {editId === todo.id ? (
                    <>
                      <input
                        className="input"
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => saveEditManual(todo.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="item-title">{todo.text}</span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className="btn btn-edit"
                          onClick={() => {
                            setEditId(todo.id);
                            setEditText(todo.text);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteManualTodo(todo.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default TodoApp;
