import React, {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import {useHistory} from 'react-router-dom'

export const CreatePage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const [link, setLink] = useState('')
    const {request} = useHttp()
    const pressHandler = async event => {
        if(event.key === 'Enter') {
            try {
               const data = await request('/api/link/generate', 'POST', {from: link}, {
                   Authorization: `Bearer ${auth.token}`
               })
               
               history.push(`/detail/${data.link._id}`)
             } catch (error) {
                
            }
        }
    }
    useEffect( () => {
        window.M.updateTextFields()
    }, [])

    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{ paddingTop: '2rem' }}>
                <div className="input-field">
                    <input
                        placeholder="Paste a link"
                        id="link"
                        type="text"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        onKeyPress = {pressHandler} />
                    <label htmlFor="first_name">Enter a link</label>
                </div>

            </div>
        </div>
    )
}