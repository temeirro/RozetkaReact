import './App.css'
import NoMatch from './components/404/NoMatch';
import AddCategory from './components/Category/AddCategory';
import HomePage from './components/Home/HomePage'
import { Route, Routes } from "react-router-dom";
import EditCategory from "./components/Category/EditCategory.tsx";
import RegisterPage from "./components/Auth/RegisterPage.tsx";

const App = () => {

  return (
    <>
      <div className="container">
        <h1 contentEditable>my rozetka</h1>
      </div>

      <Routes>
        <Route path='/addCategory' element={<AddCategory />} />
        <Route path='/EditCategory/:categoryId' element={<EditCategory/>}/>
        <Route path={"register"} element={<RegisterPage/>} />

          <Route path="/">
          <Route index element={<HomePage />} />
          <Route path='*' element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  )
}

export default App