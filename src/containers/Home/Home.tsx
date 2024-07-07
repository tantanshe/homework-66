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
          <div className="mt-3">
            <h4>Total Calories: {totalCalories} kcal</h4>
            <Link to="/addMeal" className="btn btn-primary mt-3">Add Meal</Link>
          </div>
          {meals.map(meal => (
            <div className="card mb-3 mt-3" key={meal.id}>
              <div className="card-body">
                <h5 className="card-title">{getTimeName(meal.time)}</h5>
                <p className="card-text">{meal.description}</p>
                <p className="card-text">{meal.calories} kcal</p>
                <div className="d-flex justify-content-end">
                  <Link to={`/meals/${meal.id}/edit`} className="btn btn-dark ps-5 pe-5">Edit</Link>
                  <button onClick={() => deleteMeal(meal.id as string)} className="btn btn-danger ms-3 ps-5 pe-5" disabled={isDeleting}>
                    {isDeleting && <ButtonSpinner/>}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>)}
    </div>
  );
};

export default Home;