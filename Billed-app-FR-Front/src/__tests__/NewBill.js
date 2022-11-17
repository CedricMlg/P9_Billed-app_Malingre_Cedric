/**
 * @jest-environment jsdom
 */

 import {fireEvent, screen} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import userEvent from '@testing-library/user-event'
import Store from "../app/Store.js"
import mockStore from "../__mocks__/store"

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should be able to select a file in the 'Justificatif' area", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = Store
      const newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const file = screen.getByTestId('file')
      file.addEventListener('click', handleChangeFile)
      userEvent.click(file)
      expect(handleChangeFile).toHaveBeenCalled()
    })
  })
  test('Clicking on "Envoyer" should POST a new bill', () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }));
    document.body.innerHTML = NewBillUI();

    const fakeBillData = {
      type: 'Transports',
      name: 'train Paris/Lyon',
      date: '20-10-2021',
      amount: '48',
      vat: '4',
      pct: '10',
      commentary: 'Billet 2nd classe',
      filename: 'billet-train',
      fileUrl: 'C:\\fakepath\\billet-train.png'
    };

    const form = screen.getByTestId('form-new-bill');
    fireEvent.change(screen.getByTestId('expense-type'), { target: { value: fakeBillData.type } });
    fireEvent.change(screen.getByTestId('expense-name'), { target: { value: fakeBillData.name } });
    fireEvent.change(screen.getByTestId('datepicker'), { target: { value: fakeBillData.date } });
    fireEvent.change(screen.getByTestId('amount'), { target: { value: fakeBillData.amount } });
    fireEvent.change(screen.getByTestId('vat'), { target: { value: fakeBillData.vat } });
    fireEvent.change(screen.getByTestId('pct'), { target: { value: fakeBillData.pct } });
    fireEvent.change(screen.getByTestId('commentary'), { target: { value: fakeBillData.commentary } });
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    let PREVIOUS_LOCATION = "NewBill";

    const store = jest.fn();
    const newBill = new NewBill({
      document, localStorage: window.localStorage, onNavigate, PREVIOUS_LOCATION, store
    });

    const handleSubmit = jest.fn(newBill.handleSubmit);
    newBill.newBill = jest.fn().mockResolvedValue({});
    form.addEventListener("submit", handleSubmit);
    fireEvent.submit(form);
  })
})
