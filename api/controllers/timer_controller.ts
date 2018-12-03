// Libs
import { Request, Response } from 'express';
import { Services, helpers, container, ORM } from 'artoo';
import { User, Report } from '../models';


export const index = (user: User) => (request: Request, response: Response): void => {
  (<ORM.Relation<Report>>user.reports()).where('')
}

export const start = (request: Request, response: Response): void => {

}

export const stop = (request: Request, response: Response): void => {

}