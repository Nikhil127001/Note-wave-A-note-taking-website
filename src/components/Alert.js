import React from 'react'

function Alert(props){
    
    return (
        <div>
            <div className="alert alert-dismissible fade show" role="alert">
                {props.alert.message}
            </div>
        </div>
    )
}
export default Alert;
