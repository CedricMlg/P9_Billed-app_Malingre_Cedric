/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import userEvent from '@testing-library/user-event'
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon).toBeTruthy()

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a - b) ? -1 : 1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("It should fetche bills from mock API GET", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = mockStore
      const containersBills = new Bills ({
      document, onNavigate, store, localStorage: window.localStorage,
      })
      const spyGetList = jest.spyOn(containersBills, 'getBills')
      const data = await containersBills.getBills()
      const lengthData = data.length
      expect(spyGetList).toHaveBeenCalledTimes(1)
      expect(lengthData).toBe(4)
    })
  })
  describe('When I am on Bills Page and I click on the New Bill Button', () => {
    test('A new bill form should open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const employeePage = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })

      const handleClickNewBill = jest.fn(employeePage.handleClickNewBill)
      const newBillBtn = screen.getByTestId('btn-new-bill')
      newBillBtn.addEventListener('click', handleClickNewBill)
      userEvent.click(newBillBtn)
      expect(handleClickNewBill).toHaveBeenCalled()

      const form = screen.getByTestId('form-new-bill')
      expect(form).toBeTruthy()
    })
  })
  describe('When I click on the icon eye', () => {
    test('A modal should open', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const employeePage = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })
      document.body.innerHTML = BillsUI({ data: bills })

      const handleClickIconEye = jest.fn(employeePage.handleClickIconEye)
      const eye = screen.getAllByTestId('icon-eye')[0]
      $.fn.modal = jest.fn()
      eye.addEventListener('click', () => handleClickIconEye(eye))
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()

      const modale = screen.getByText('Justificatif')
      expect(modale).toBeTruthy()
    })
  })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})

      const loading = undefined
      const error = "Erreur 404"
      document.body.innerHTML = BillsUI({data: bills, loading, error})
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      const loading = undefined
      const error = "Erreur 500"
      document.body.innerHTML = BillsUI({data: bills, loading, error})
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
