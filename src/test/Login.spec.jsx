import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Login from "../paginas/Login.jsx"

describe("Componente Login", () => {

  afterEach(() => {
    cleanup()
  })

  it("muestra el formulario de login con los campos correctos", () => {
    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    )

    const selectRol = screen.getByLabelText("Rol")
    const inputEmail = screen.getByLabelText("Correo electrónico")
    const inputPassword = screen.getByLabelText("Contraseña")
    const boton = screen.getByRole("button", { name: "Ingresar" })

    expect(selectRol).toBeTruthy()
    expect(inputEmail).toBeTruthy()
    expect(inputPassword).toBeTruthy()
    expect(boton).toBeTruthy()
  }) // fin prueba 1

  it("muestra error cuando el correo tiene formato invalido", () => {
    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    )

    const boton = screen.getByRole("button", { name: "Ingresar" })
    fireEvent.click(boton)

    const errorEmail = screen.getByText("Ingrese un correo válido (@duoc.cl, @gmail.com).")
    expect(errorEmail).toBeTruthy()
  }) // fin prueba 2

  it("muestra error cuando no se selecciona un rol", () => {
    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    )

    const boton = screen.getByRole("button", { name: "Ingresar" })
    fireEvent.click(boton)

    const errorRol = screen.getByText("Seleccione un rol.")
    expect(errorRol).toBeTruthy()
  }) // fin prueba 3

}) // fin describe Login
