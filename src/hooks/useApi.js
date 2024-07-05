import React, { useEffect, useState, useRef } from 'react';

export const useApi = async ({url}) => {

    return new Promise( async (resolve, reject) => {

        try {

            const fetchResult = await fetch(url);

            if(fetchResult.json) {

                const json = fetchResult.json();
                resolve(json);

            } else if(fetchResult.text) {

                const json = fetchResult.json();
                resolve(json);

            } else {

                throw "ERROR::useApi:BadData:Ошибка Получения данных"
            }
            

        } catch (e) {

            console.log(e)
            console.log("ERROR::useApi:FatalFetchError:Ошибка запроса")

            resolve(false)

        }

    })
}

