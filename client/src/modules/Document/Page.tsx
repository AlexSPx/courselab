import React, { useCallback, useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../contexts/SocketContext";
import { DocumentInterface, GeneralUserInformation } from "../../interfaces";
import { Left, Main, Right } from "../Layouts/MainLayout";
import DocumentSettings from "./DocumentSettings";
import { useRouter } from "next/router";

import Quill from "quill";
import QuillCursors from "quill-cursors";
import { UserContext } from "../../contexts/UserContext";
import randomColor from "../../lib/randomColor";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function Page({ doc }: { doc: DocumentInterface }) {
  const [quill, setQuill] = useState<Quill>();
  const [cursors, setCursors] = useState<QuillCursors>();
  const [readOnly, setReadOnly] = useState(true);

  const [usersInDoc, setUsersInDoc] = useState<GeneralUserInformation[]>([]);

  const { socket } = useContext(WebSocketContext);
  const { userData } = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    if (!quill || !cursors) return;
    usersInDoc.forEach((user) => {
      cursors.createCursor(user.username, user.username, randomColor());
    });
  }, [cursors, quill, usersInDoc]);

  useEffect(() => {
    if (!socket || !quill) return;

    quill.setContents(JSON.parse(doc.file as any));

    if (
      doc.members.some(
        (mmbr) => mmbr.user.id === userData?.user?.id && mmbr.role !== "READER"
      )
    )
      setReadOnly(false);

    const autoSave = setInterval(() => {
      const value = quill.getContents();

      if (value) {
        console.log("saving");

        socket.emit("save-document", {
          id: doc.id,
          file: JSON.stringify(value),
        });
      }
    }, 5000);

    return () => clearInterval(autoSave);
  }, [quill, socket, doc.id, doc.file, doc.members, userData?.user?.id]);

  useEffect(() => {
    if (!socket) return;

    // User changes
    const onDisconnect = () => {
      socket.emit("leave-document", { docId: doc.id });
    };

    const handleInDoc = ({ users }: { users: GeneralUserInformation[] }) => {
      setUsersInDoc(users);
    };

    const handleLeaveDoc = ({
      whoLeft,
    }: {
      whoLeft: GeneralUserInformation;
    }) => {
      if (!whoLeft) return;
      setUsersInDoc((prev) => prev.filter((el) => el.id !== whoLeft.id));
    };

    socket.on(`doc-users`, handleInDoc);
    socket.on("leave-document", handleLeaveDoc);

    socket.emit("join-document", { docId: doc.id });

    router.events.on("routeChangeStart", onDisconnect);
    router.events.on("routeChangeComplete", onDisconnect);

    window.addEventListener("beforeunload", onDisconnect);

    return () => {
      router.events.off("routeChangeStart", onDisconnect);
      router.events.on("routeChangeComplete", onDisconnect);
      window.removeEventListener("beforeunload", onDisconnect);

      socket.off("leave-document", handleLeaveDoc);
      socket.off(`doc-users`, handleInDoc);
    };
  }, [doc.id, router.events, socket]);

  useEffect(() => {
    if (socket === null || !quill) return;

    // Emits changes
    const tracker = (delta: any, _oldDelta: any, source: string) => {
      if (source !== "user") return;
      socket.emit("docs-change", { delta, id: doc.id });
    };

    const cursorTracker = (range: any, _oldRange: any, source: any) => {
      if (source !== "user") return;
      socket.emit("cursor-change", {
        range,
        docId: doc.id,
        id: `${userData?.user?.username}`,
      });
    };

    quill.on("text-change", tracker);
    quill.on("selection-change", cursorTracker);

    return () => {
      quill.off("text-change", tracker);
    };
  }, [doc.id, quill, socket, userData?.user?.username]);

  useEffect(() => {
    if (socket == null || !quill || !cursors) return;

    // Handles incomming changes
    const handler = (delta: any) => {
      quill.updateContents(delta);
    };
    console.log(cursors);

    const cursorHandler = ({ range, id }: { range: any; id: string }) => {
      cursors.moveCursor(id, range);
    };

    socket.on(`remote-change`, handler);
    socket.on("cursor-select", cursorHandler);

    return () => {
      socket.off(`remote-change`, handler);
      socket.off("cursor-select", cursorHandler);
    };
  }, [quill, doc.id, socket, cursors]);

  // Editor setup
  const wrapperRef = useCallback(
    (wrapper: HTMLDivElement) => {
      if (typeof window === "undefined") return;
      if (wrapper === null) return;

      Quill.register("modules/cursors", QuillCursors);

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const q = new Quill(editor, {
        theme: "snow",
        placeholder: "Type here...",
        readOnly: readOnly,
        modules: {
          toolbar: !readOnly && TOOLBAR_OPTIONS,
          cursors: {
            transformOnTextChange: true,
          },
        },
      });

      setCursors(q.getModule("cursors"));
      setQuill(q);
    },
    [readOnly]
  );

  return (
    <>
      <Left></Left>
      <div className="divider divider-vertical sticky top-0"></div>
      <Main css="items-center w-screen sm:min-h-[32rem]">
        <div
          style={{ width: "85%" }}
          ref={wrapperRef}
          className="page w-full"
          id="journal-scroll"
        ></div>
      </Main>
      <div className="divider divider-vertical sticky top-0"></div>
      <DocumentSettings doc={doc} UsersInDoc={usersInDoc} />
    </>
  );
}
