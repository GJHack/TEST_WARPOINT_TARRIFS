import React, { useEffect, useState, useRef, useLayoutEffect, act } from 'react';

//Хуки
import { useApi } from '../hooks/useApi';

//Другие компоненты

import { Loader } from './Loader';

import styles from '../css/Tarrifs.module.css';

const App = ({}) => {

    const [data, setData] = useState(null),
          [currencies, setCurrencies] = useState(null),
          [active, setActive] = useState(null);

    const handleClick = async (e) => {
        /////Куда то отправляем данные
        console.log('Куда то отправляем данные')
    }      

    useLayoutEffect(() => {

        async function fetchData() {

            const fetchData = await useApi({url: import.meta.env.VITE_TARRIFS_API});
            setData(fetchData.tarrifs);

            const fetchCurrencies =  await useApi({url: `${import.meta.env.VITE_URL_CURRENCY_API}`});
            setCurrencies(fetchCurrencies.rates)
        }

        fetchData();

    }, [])

    useEffect(() => {}, [active])

    return(
        <section className = {`${styles.container}`}>

            <h2>Нажмите, чтобы посмотреть тариф</h2>

            <div>
                
                {
                    (data && Array.isArray(data)) 
                        ? 
                        data.map( (item, index) => { 
                            return <Tarrif key = {`key_tarrif_${index}_${item.name}`} index = {index} data = {item} active = {active} setActive = {setActive} /> 
                        }) 
                        : <Loader />
                }

            </div>
     
            {
                (active) ? <ActiveTarrif data = {active} active = {active} setActive = {setActive}/> : <h2>Выберите тариф</h2>
            }

            <article className = {`${styles.currenciesBlock}`}>

                {
                    (currencies && active) 
                        ?
                        <>
                            <div>
                                <h2>В тенге</h2>
                                <p>{active[active.activeTime] * currencies.KZT}</p>
                            </div>
                            <div>
                                <h2>В Юанях</h2>
                                <p>{active[active.activeTime] * currencies.CNY}</p>
                            </div>
                        </>
                        : null
                }
             
            </article>

            <button onClick = { (e) => {handleClick(e)}}> Заказать сейчас!</button>

        </section>
    )
}

const Tarrif = ({index = null, data = null, active = null, setActive = null}) => {

    if(!data || !setActive) return (<h2>Ошибка вывода тарифа</h2>)

    const handleClick = (e) => {

        e.preventDefault();
        //Тут еще дописать чек на тач через проверку экрана, чтобы не дублировались нажатия
        setActive(data);

    }

    return(
            <button
                onClick = {
                    (e) => handleClick(e)
                }
            >
                {data.name}
            </button>
    )
}

const ActiveTarrif = ({data = null, active = null, setActive = null}) => {
    
    if(!data) return (

        <article className = {`${styles.onceTarrif}`}>
            <h2>Тариф не выбран</h2>
        </article>
    
    )

    const handleClick = (e, activeTime) => {

        const tempActive = {...active};
        tempActive.activeTime = activeTime;
        setActive(tempActive);

    }

    return(
        
        <article key = {`key_article_${data.name}`} className = {`${styles.onceTarrif}`}>

                <h3>{data.name}</h3>

                <div>
                    <div>
                        <h3>С оплатой за месяц</h3>
                        <button onClick = { (e) => handleClick(e, 'priceMonth')}>{data.priceMonth} ₽</button>
                    </div>
                    <div>
                        <h3>С оплатой за год</h3>
                        <button onClick = { (e) => handleClick(e, 'priceYear')}>{data.priceYear} ₽</button>
                    </div>
                </div>
                
        </article>
    )
}

export default App;