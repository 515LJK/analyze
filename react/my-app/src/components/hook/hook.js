import React, {useState, useEffect} from 'react';

function Hook() {
  const [count] = useState(0);

  useEffect(()=>{
    console.log(count)
  });

  return (
    <div className="hook">
      {count}
    </div>
  )
}

export default Hook;