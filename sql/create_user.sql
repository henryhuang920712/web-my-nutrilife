CREATE OR REPLACE FUNCTION public.register_user(
    p_u_name character varying,
    p_password character varying,
    p_email character varying,
    p_birth_date date,
    p_gender character
) RETURNS TEXT AS $BODY$
DECLARE
    calculated_t_id INTEGER;
    user_age INTEGER;
    existing_count INTEGER;
BEGIN
    user_age := EXTRACT(YEAR FROM AGE(p_birth_date));

    -- Check if the username or email already exists
    SELECT COUNT(*) INTO existing_count
    FROM public.users
    WHERE u_name = p_u_name OR email = p_email;

    IF existing_count > 0 THEN
        RETURN 'Username or email already exists';
    END IF;

    -- Find the appropriate t_id based on gender and age
    SELECT t_id INTO calculated_t_id
    FROM public.user_type
    WHERE gender = p_gender
      AND user_age BETWEEN min_age AND max_age
    LIMIT 1;

    IF calculated_t_id IS NULL THEN
        RETURN 'Unable to find the corresponding t_id for gender ' || p_gender || ' and age ' || user_age;
    END IF;

    -- Insert the new user data into the users table
    INSERT INTO public.users (u_name, password, email, birth_date, created_date, t_id)
    VALUES (p_u_name, p_password, p_email, p_birth_date, CURRENT_DATE, calculated_t_id);

    -- Return success message
    RETURN 'User registered successfully!';
END;
$BODY$
LANGUAGE plpgsql;
