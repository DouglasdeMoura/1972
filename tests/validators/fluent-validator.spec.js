import { describe, expect, it } from 'vitest'

import ValidationContract from '../../src/validators/fluent-validator.js'

describe('ValidationContract', () => {
  it('deve requerer a presença de um valor', () => {
    const contract = new ValidationContract()
    contract.isRequired('title', '', 'O título é obrigatório')

    expect(contract.errors()).toEqual([
      { name: 'title', message: 'O título é obrigatório' },
    ])
  })

  it('deve requerer um valor com tamanho mínimo', () => {
    const contract = new ValidationContract()
    contract.hasMinLen(
      'title',
      'a',
      3,
      'O título deve conter pelo menos 3 caracteres',
    )

    expect(contract.errors()).toEqual([
      {
        name: 'title',
        message: 'O título deve conter pelo menos 3 caracteres',
      },
    ])
  })

  it('deve requerer um valor com tamanho máximo', () => {
    const contract = new ValidationContract()
    contract.hasMaxLen(
      'title',
      'abcdefghij',
      3,
      'O título deve conter no máximo 3 caracteres',
    )

    expect(contract.errors()).toEqual([
      {
        name: 'title',
        message: 'O título deve conter no máximo 3 caracteres',
      },
    ])
  })

  it('deve requerer um número', () => {
    const contract = new ValidationContract()
    contract.isNumber('price', 'abc', 'O preço deve ser um número')
    contract.isNumber('quantity', '1', 'A quantidade deve ser um número')

    expect(contract.errors()).toEqual([
      { name: 'price', message: 'O preço deve ser um número' },
      { name: 'quantity', message: 'A quantidade deve ser um número' },
    ])
  })

  it('deve ter um tamanho fixo', () => {
    const contract = new ValidationContract()
    contract.isFixedLen('title', 'abcd', 3, 'O título deve conter 3 caracteres')

    expect(contract.errors()).toEqual([
      { name: 'title', message: 'O título deve conter 3 caracteres' },
    ])
  })

  it('deve ser um e-mail válido', () => {
    const contract = new ValidationContract()
    contract.isEmail('email', 'abc', 'O e-mail é inválido')

    expect(contract.errors()).toEqual([
      { name: 'email', message: 'O e-mail é inválido' },
    ])
  })

  it('deve retornar todos os erros', () => {
    const contract = new ValidationContract()
    contract.isEmail('email', 'abc', 'O e-mail é inválido')
    contract.isFixedLen('title', 'abcd', 3, 'O título deve conter 3 caracteres')
    contract.isNumber('price', 'abc', 'O preço deve ser um número')

    expect(contract.errors()).toEqual([
      { name: 'email', message: 'O e-mail é inválido' },
      { name: 'title', message: 'O título deve conter 3 caracteres' },
      { name: 'price', message: 'O preço deve ser um número' },
    ])
  })

  it('deve informar quando o contrato é válido', () => {
    const contract = new ValidationContract()
    expect(contract.isValid()).toBe(true)

    contract.isEmail('email', 'abc', 'O e-mail é inválido')

    expect(contract.isValid()).toBe(false)
  })

  it('deve limpar os erros', () => {
    const contract = new ValidationContract()
    expect(contract.isValid()).toBe(true)

    contract.isEmail('email', 'abc', 'O e-mail é inválido')
    expect(contract.isValid()).toBe(false)

    contract.clear()
    expect(contract.isValid()).toBe(true)
  })
})
