import './App.css'
import { Button } from './components/ui/button'

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold underline text-red-500 my-2">
          Hello world!
        </h1>
        <Button variant={'secondary'} className='text-white bg-black hover:bg-white hover:text-black'>Click me</Button>
      </div>
    </>
  )
}

export default App
