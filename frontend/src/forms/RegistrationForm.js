import React, {useRef} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';


export default function RegisterForm({ onSubmit, onChange, formData }) {

  const registerForm = useRef("registerForm")

  return (
    <Card className="login-and-registration-card">
      <ValidatorForm
        ref={registerForm}
        onSubmit={onSubmit}
      >
        <CardContent id="login-card-content">
          <TextValidator
            label="Email"
            onChange={onChange}
            name="email"
            value={formData.email}
            validators={['required', 'isEmail']}
            errorMessages={['Email is required', 'Email is not valid']}
          />
          <TextValidator
            label="First name"
            onChange={onChange}
            name="firstName"
            value={formData.firstName}
            validators={['required']}
            errorMessages={['First name is required']}
          />
          <TextValidator
            label="Last name"
            onChange={onChange}
            name="lastName"
            value={formData.lastName}
            validators={['required']}
            errorMessages={['Last name is required']}
          />
          <TextValidator
            label="Password"
            onChange={onChange}
            name="password"
            value={formData.password}
            validators={['required']}
            type="password"
            
            errorMessages={['Password is required']}
          />
        </CardContent>
        <CardActions className="login-and-registration-actions">
        <Button
            color="primary"
            variant="contained"
            type="submit"
        >
            Submit
        </Button>
        </CardActions>
      </ValidatorForm>

    </Card>
  );
}
