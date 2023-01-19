let errors = []

function ValidationContract() {
  errors = []
}

ValidationContract.prototype.isRequired = (name, value, message) => {
  if (!value || value.length <= 0) {
    errors.push({ name, message })
  }
}

ValidationContract.prototype.hasMinLen = (name, value, min, message) => {
  if (!value || value.length < min) {
    errors.push({ name, message })
  }
}

ValidationContract.prototype.hasMaxLen = (name, value, max, message) => {
  if (!value || value.length > max) {
    errors.push({ name, message })
  }
}

ValidationContract.prototype.isNumber = (name, value, message) => {
  if (!value || typeof value !== 'number' || !isFinite(value)) {
    errors.push({ name, message })
  }
}

ValidationContract.prototype.isFixedLen = (name, value, len, message) => {
  if (value.length !== len) {
    errors.push({ name, message })
  }
}

ValidationContract.prototype.isEmail = (name, value, message) => {
  const reg = /^\S+@\S+\.\S+$/
  if (!reg.test(value)) {
    errors.push({ name, message })
  }
}

ValidationContract.prototype.errors = () => {
  return errors
}

ValidationContract.prototype.clear = () => {
  errors = []
}

ValidationContract.prototype.isValid = () => {
  return errors.length === 0
}

export default ValidationContract
