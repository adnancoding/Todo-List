import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckIcon from "@mui/icons-material/Check";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Scrollbars } from "react-custom-scrollbars-2";

export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const navigate = useNavigate();
  const toastOptions = {
    position: "top-center",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        toast("come Back soon..", toastOptions);
      })
      .catch((err) => {
        toast.error(err.message, toastOptions);
      });
  };

  const writeToDatabase = () => {
    const uidd = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: todo,
      uidd: uidd,
    });

    setTodo("");
    toast.success("Todo Added Successfully..", toastOptions);
  };

  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
  };

  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo,
      tempUidd: tempUidd,
    });

    setTodo("");
    setIsEdit(false);
    toast.success("Todo Updated Successfully..", toastOptions);
  };

  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
    toast.info("Todo Deleted Successfully..", toastOptions);
  };

  return (
    <div className="homepage">
      <div className="top-styling">
        <h1>
          <EventNoteOutlinedIcon fontSize="large" className="logo" />
          Todo-List
        </h1>
        <LogoutIcon
          onClick={handleSignOut}
          fontSize="large"
          className="logout-icon"
        />
      </div>
      <div className="board">
        <Scrollbars>
          <div className="input-styling">
            <input
              className="add-edit-input"
              type="text"
              placeholder="Add todo..."
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
            />
            {isEdit ? (
              <div>
                <CheckIcon
                  onClick={handleEditConfirm}
                  className="add-confirm-icon"
                />
              </div>
            ) : (
              <div>
                <AddIcon
                  onClick={writeToDatabase}
                  className="add-confirm-icon"
                />
              </div>
            )}
          </div>

          {todos.map((todo) => (
            <div className="todo">
              <h1>{todo.todo}</h1>
              <EditIcon
                fontSize="large"
                onClick={() => handleUpdate(todo)}
                className="edit-button"
              />
              <DeleteForeverTwoToneIcon
                fontSize="large"
                onClick={() => handleDelete(todo.uidd)}
                className="delete-button"
              />
            </div>
          ))}
        </Scrollbars>
      </div>
      <ToastContainer />
    </div>
  );
}
