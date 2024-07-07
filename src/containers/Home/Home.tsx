import React, {useCallback, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Meal, times} from '../../types';
import axiosApi from '../../axiosApi';
import Spinner from '../../components/Spinner/Spinner';
import ButtonSpinner from '../../components/Spinner/ButtonSpinner';

const Home = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const {id} = useParams();

  const fetchMeals = useCallback(async () => {
    setIsLoading(true);

    try {
      let response;
      response = await axiosApi.get<Meal | null>('meals.json');
      const mealsResponse = response.data;

      if (mealsResponse) {
        const mealsList: Meal[] = Object.keys(mealsResponse).map((id: string) => ({
          ...mealsResponse[id],
          id,
          calories: parseInt(mealsResponse[id].calories),
        }));

        setMeals(mealsList.reverse());
        const totalCalories = mealsList.reduce((sum, meal) => {
          return sum + meal.calories;
        }, 0);
        setTotalCalories(totalCalories);

      } else {
        setMeals([]);
        setTotalCalories(0);
      }

    } catch (error) {
      console.error(error);
      setMeals([]);
      setTotalCalories(0);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchMeals();
  }, [fetchMeals, id]);

  const deleteMeal = async (id: string) => {
    setIsDeleting(true);
    try {
      await axiosApi.delete(`meals/${id}.json`);
      const updatedMeals = meals.filter(meal => meal.id !== id);
      setMeals(updatedMeals);
      const totalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
      setTotalCalories(totalCalories);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTimeName = (timeId: string): string => {
    const time = times.find(t => t.id === timeId);
    return time ? time.name : timeId;
  };

  return (
    <div className="mt-3">
      {isLoading && (<Spinner/>)}
      {!isLoading && (
        <div>
          {(meals.length === 0 && !isLoading) && (
            <h5>There are no meals yet</h5>
          )}
          <div className="mt-3 d-flex justify-content-between align-items-center">
            <h4>Total Calories: {totalCalories} kcal</h4>
            <Link to="/addMeal" className="btn btn-primary ps-5 pe-5">Add Meal</Link>
          </div>
          {meals.map(meal => (
            <div className="card mb-3 mt-3" key={meal.id}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title text-muted">{getTimeName(meal.time)}</h5>
                  <p className="card-text">{meal.description}</p>

                </div>
                <div className='d-flex align-items-center'>
                  <p className="card-text me-5 mb-0"><strong>{meal.calories} kcal</strong></p>
                  <div className="d-flex justify-content-end flex-column w-10">
                    <Link to={`/meals/${meal.id}/edit`} className="btn btn-success">
                      <img src='https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png'
                           alt="edit" className="button-icon"/>
                    </Link>
                    <button onClick={() => deleteMeal(meal.id as string)} className="btn btn-danger mt-3"
                            disabled={isDeleting}>
                      {isDeleting && <ButtonSpinner/>}
                      <img src='https://static-00.iconduck.com/assets.00/delete-icon-1877x2048-1t1g6f82.png' alt="trash"
                           className="button-icon"/>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>)}
    </div>
  );
};

export default Home;