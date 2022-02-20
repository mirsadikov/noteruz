import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
import Auth from "../components/Auth";
import { createNote, getUserNotes, noteDelete } from "../actions/noteActions";
import Loader from "../components/Loader";
import { TelegramFill, TrashCan, Plus, SignOut, Cross } from "akar-icons";

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
    const [deleteOn, setDeleteOn] = useState(false);
    const [createOn, setCreateOn] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const botLoader = useRef();

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
        botLoader.current.classList.toggle("hidden");
        const res = await fetch("/api/user/linktg", {
            method: "POST",
        });
        const link = await res.json();
        if (!res.ok || !link.ok) alert("Failed!");
        else {
            window.open(link.url, "_blank");
            alert("Please reload after starting bot!");
        }
        botLoader.current.classList.toggle("hidden");
    };

    const createNoteHandler = (e) => {
        e.preventDefault();
        setCreateOn(false);
        dispatch(createNote(noteTitle, noteDesc));
        setNoteTitle("");
        setNoteDesc("");
    };

    const handleDelete = (e) => {
        const deleteBtn = e.target.closest("button.inlineBtn");
        if (deleteBtn) {
            const noteToDelete = e.target.closest("li");
            dispatch(noteDelete(noteToDelete.dataset.id));
        }
    };

    return (
        <>
            <div className={createOn ? "flex container" : "container"}>
                <div className="box">
                    {!profile && <Auth />}
                    {/* {loading && <p>loading...</p>} */}
                    {error && <p>{error}</p>}
                    {!telegram && (
                        <button className="btn" onClick={connectBotHandler}>
                            <TelegramFill strokeWidth={2} size={20} /> Connect
                            Telegram bot
                        </button>
                    )}
                    <div className="hidden" ref={botLoader}>
                        <Loader />
                    </div>
                    <ul
                        className={`list ${deleteOn ? "" : "hideDeleteBtn"}`}
                        onClick={handleDelete}
                    >
                        {notes.length > 0 ? (
                            notes.map((note) => (
                                <li key={note._id} data-id={note._id}>
                                    <h3 className="noteTitle">{note.title}</h3>
                                    <p className="noteDesc">{note.desc}</p>
                                    <button className="inlineBtn">
                                        <Cross strokeWidth={2} size={15} />
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li>You don't have any notes!</li>
                        )}
                    </ul>
                </div>
                {noteLoading ? (
                    <Loader />
                ) : (
                    <form className="form box" onSubmit={createNoteHandler}>
                        <div>
                            <b className="form-label title2">Create note</b>
                        </div>

                        <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            placeholder="title"
                            required
                        />
                        <textarea
                            type="text"
                            rows={8}
                            value={noteDesc}
                            onChange={(e) => setNoteDesc(e.target.value)}
                            placeholder="desctiption"
                            required
                        />
                        <input type="submit" value="Create" />
                    </form>
                )}
            </div>

            <div className={profile ? "bar" : "bar hiddenbar"}>
                <button
                    className={`${deleteOn ? "red" : ""}`}
                    onClick={() => setDeleteOn((s) => !s)}
                >
                    <TrashCan strokeWidth={2} size={25} />
                </button>
                <button
                    onClick={(e) => {
                        e.currentTarget.classList.toggle("rotate45");
                        setCreateOn((s) => !s);
                    }}
                    className="btnPlus"
                >
                    <Plus strokeWidth={2} size={35} />
                </button>
                <button onClick={handleLogOut}>
                    <SignOut strokeWidth={2} size={25} />
                </button>
            </div>
        </>
    );
}

export default Home;
