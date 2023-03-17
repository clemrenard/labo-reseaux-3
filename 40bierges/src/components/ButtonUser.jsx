import React from "react";

/* -- core components -- */
import '../assets/css/main.css'

function ButtonUser({handleClick}) {
    return (
        <>
            <div className={"my-4 flex flex-col"}>
                Si tu souhaites afficher ton secret, clique sur le bouton ci-dessous ↴
                <button className={"rounded bg-black p-4 font-mono text-white"} onClick={handleClick}>↯ Ce bouton !</button>
            </div>
        </>
    );
}

export default ButtonUser;