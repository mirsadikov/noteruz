import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
import Auth from "../components/Auth";
import { createNote, getUserNotes, noteDelete } from "../actions/noteActions";
import Loader from "../components/Loader";

function Home() {
    const { profile, error, ok } = useSelector((state) => state.user);
    const {
        notes: noteList,
        error: notesError,
        ok: notesOk,
        noteLoading,
    } = useSelector((state) => state.notes);

    const [telegram, setTelegram] = useState("");
    const [notes, setnotes] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [noteTitle, setNoteTitle] = useState("");
    const [noteDesc, setNoteDesc] = useState("");

    useEffect(() => {
        if (!error && ok && profile) {
            setTelegram(profile.telegramId);
        }
    }, [profile, ok, error]);

    useEffect(() => {
        if (!notesError && !noteList && profile) {
            dispatch(getUserNotes());
        }
        if (!notesError && notesOk && noteList) setnotes(noteList);
    }, [noteList, notesError, notesOk, dispatch, notes, profile]);

    const handleLogOut = (e) => {
        dispatch(logOut());
        navigate("/");
    };

    const connectBotHandler = async (e) => {
        const res = await fetch("/api/user/linktg", {
            method: "POST",
        });
        const link = await res.json();
        console.log(link);
        if (!res.ok || !link.ok) alert("Failed!");
        else {
            window.open(link.url, "_blank");
            alert("Please reload after starting bot!");
        }
    };

    const createNoteHandler = (e) => {
        e.preventDefault();
        dispatch(createNote(noteTitle, noteDesc));
        setNoteTitle("");
        setNoteDesc("");
    };

    const handleDelete = (e) => {
        if (e.target !== e.currentTarget) {
            const noteToDelete = e.target.closest("li");
            dispatch(noteDelete(noteToDelete.dataset.id));
        }
    };

    return (
        <>
            <div>
                {!profile && <Auth />}
                {/* {loading && <p>loading...</p>} */}
                {error && <p>{error}</p>}
                <h1>
                    {!telegram && (
                        <button onClick={connectBotHandler}>Connect Bot</button>
                    )}
                </h1>
                <ul onClick={handleDelete}>
                    {notes &&
                        notes.map((note) => (
                            <li key={note._id} data-id={note._id}>
                                {note.title} - {note.desc} - <button>❌</button>
                            </li>
                        ))}
                </ul>
                {noteLoading ? (
                    <Loader />
                ) : (
                    <form onSubmit={createNoteHandler}>
                        <div>
                            <b>Create note</b>
                        </div>

                        <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            placeholder="title"
                        />
                        <input
                            type="text"
                            value={noteDesc}
                            onChange={(e) => setNoteDesc(e.target.value)}
                            placeholder="desctiption"
                        />
                        <input type="submit" />
                    </form>
                )}
            </div>
            {profile && (
                <div>
                    <button onClick={handleLogOut}>Log out</button>
                </div>
            )}
        </>
    );
}

export default Home;
