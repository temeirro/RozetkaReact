import './App.css'
import NoMatch from './components/404/NoMatch';
import AddCategory from './components/Category/AddCategory';
import HomePage from './components/Home/HomePage'
import { Route, Routes } from "react-router-dom";

const App = () => {

  return (
    <>
      <Routes>
        <Route path='/addCategory' element={<AddCategory />} />
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path='*' element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  )
}

export default App