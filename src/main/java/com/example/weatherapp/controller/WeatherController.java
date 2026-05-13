package com.example.weatherapp.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/weather")
@CrossOrigin
public class WeatherController {

    @GetMapping
    public String getWeather(@RequestParam double lat, @RequestParam double lon) {

        String url = "https://api.open-meteo.com/v1/forecast?latitude="
                + lat + "&longitude=" + lon
                + "&current=temperature_2m,is_day,weather_code"
                + "&daily=temperature_2m_max,temperature_2m_min&timezone=auto";

        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, String.class);
    }
}