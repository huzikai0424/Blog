import React, { Component } from 'react';
import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import axios from 'axios'
class Editor extends Component {
    constructor(props) {
        super(props);
        
    }
    componentDidMount() {
        axios.get(`/getArticle/15`)
        .then((res) => {
            this.smde = new SimpleMDE({ 
                element: document.getElementById("editor"),
                spellChecker:false,
                autofocus:true,
                promptURLs:true,
                status: ["autosave", "lines", "words", "cursor"],
                styleSelectedText:false,
                initialValue:res.data.posts
            })
        })
        .catch((error) => {
            console.log(error);
        });

        // this.smde = new SimpleMDE({ 
        //     element: document.getElementById("editor"),
        //     spellChecker:false,
        //     autofocus:true,
        //     promptURLs:true,
        //     status: ["autosave", "lines", "words", "cursor"],
        //     styleSelectedText:false,
        //     initialValue:""

        // })
    }
    render(){
        return(
            <div>
                <textarea id="editor"></textarea>
                <span>editor</span>
            </div>
        )
    }
}
export default Editor