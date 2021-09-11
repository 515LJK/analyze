import React, {useState, useEffect} from 'react';

function Hook() {
  const [count, setCount] = useState(0);

  useEffect(()=>{
    console.log(count)
  }, [count]);

  function add() {
    setCount(count=>count+1)
  }

  return (
    <div className="hook" onClick={add}>
      {count}
    </div>
  )
}

export default Hook;