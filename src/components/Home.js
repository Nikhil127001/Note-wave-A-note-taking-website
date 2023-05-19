import Notes from './Notes';
import { useNavigate } from 'react-router-dom';

export const Home = (props) => {
    const navigate = useNavigate();
    const {showAlert} = props;
    if (!localStorage.getItem("token")) {
        navigate("/login")
    } 

    return (
        <div> 
            <Notes showAlert = {showAlert}/>
        </div>
    )
}
