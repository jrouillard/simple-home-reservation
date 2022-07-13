
import './App.css';
import Calendar from './Calendar';

function App() {
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  return (
    <div className="App">
      <header className="App-header">
        <span className="place-name">Quiberon</span>
      </header>
      <div className="center-content">
        <Calendar semester year={currentYear} month={currentMonth}></Calendar>
      </div>
    </div>
  );
}

export default App;
