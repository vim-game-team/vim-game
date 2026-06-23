import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { appConfig } from './app/app.config';
import { App } from "./app/app"

bootstrapApplication(App, appConfig)
.catch((error)=>console.log("ERROR: " + error));