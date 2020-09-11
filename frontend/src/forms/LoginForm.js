import React, {useRef} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';


export default function LoginForm({ onSubmit, onChange, formData }) {

  const loginForm = useRef("loginForm")

  return (
    <Card className="login-and-registration-card">
      <ValidatorForm
        ref={loginForm}
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
