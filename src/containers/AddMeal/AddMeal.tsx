import React, {useCallback, useEffect, useState} from 'react';
import axiosApi from '../../axiosApi';
import {Meal, times} from '../../types';
import {useNavigate, useParams} from 'react-router-dom';
import ButtonSpinner from '../../components/Spinner/ButtonSpinner';
import Spinner from '../../components/Spinner/Spinner';

const initialState: Meal = {
  time: '',
  description: '',
  calories: 0,
};

const AddMeal = () => {
  const {id} = useParams<{ id: string }>();
  const [meal, setMeal] = useState<Meal>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchOneMeal = useCallback(async (id: string) => {
    setIsLoading(true);
    const response = await axiosApi.get<Meal | null>(`meals/${id}.json`);
    if (response.data) {
      setMeal(response.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      void fetchOneMeal(id);
    } else {
      setMeal(initialState);
    }
  }, [id, fetchOneMeal]);


  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;

    setMeal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMeal: Meal = {
      time: meal.time,
      description: meal.description,
      calories: meal.calories,
    };

    try {
      setIsSaving(true)
      if (id !== undefined) {
        await axiosApi.put(`/meals/${id}.json`, newMeal);
      } else {
        await axiosApi.post('/meals.json', newMeal);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="row mt-3">
      {isLoading && (<Spinner/>)}
      {!isLoading && (
      <div className="col">
        <form onSubmit={onFormSubmit}>
          <h2>{id ? 'Edit the meal' : 'Add a new meal'}</h2>
          <div className="form-group mt-2">
            <select
              id="time"
              name="time"
              className="form-control"
              value={meal.time}
              onChange={onFieldChange}
              required
            >
              <option value="" disabled>Select the time of the meal</option>
              {times.map(time => (
                <option key={time.id} value={time.id}>{time.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group mt-2">
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={meal.description}
              onChange={onFieldChange}
              placeholder="Description of the meal"
              required
            />
          </div>
          <div className="form-group mt-2">
            <label className="mb-2 d-block" htmlFor="calories">Calories of the meal</label>
            <input
              id="calories"
              name="calories"
              type="number"
              className="form-control me-2 d-inline"
              style={{width: '200px'}}
              value={meal.calories}
              onChange={onFieldChange}
              required
            />
            <span>kcal</span>
          </div>
          <button type="submit" className="btn btn-primary mt-3 ps-5 pe-5" disabled={isSaving}>
            {isSaving && <ButtonSpinner />}
            {id ? 'Save changes' : 'Save'}
          </button>
        </form>
      </div>)}
    </div>
  );
};

export default AddMeal;