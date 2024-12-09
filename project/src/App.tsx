import { useEffect } from 'react';
import axios from 'axios';

const App = () => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api');
      console.log(response.data);
    };
    fetchData();
  }, []);

  return <div className="App">Check the console for API response!</div>;
};

export default App;
