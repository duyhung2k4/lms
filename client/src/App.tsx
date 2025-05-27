import AppRouter from './routers'
import { useEffect } from 'react';
import { BaseQueryAnyRequestDefaultFilter } from './dto/base';
import { useFilterQuery } from './redux/api/base'
import { useAppDispatch } from './redux/hook';
import { getAllDepartment } from './redux/slice/constant.slice';

function App() {
  const dispatch = useAppDispatch();
  const {
    data: dataDepartment,
    refetch: refetchDepartment,
  } = useFilterQuery({
    ...BaseQueryAnyRequestDefaultFilter,
    modelName: "departments",
  });

  useEffect(() => {
    dispatch(getAllDepartment(dataDepartment?.data || []));
  }, [dataDepartment]);

  useEffect(() => {
    refetchDepartment();
  }, []);

  return (
    <>
      <AppRouter/>
    </>
  )
}

export default App
