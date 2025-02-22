DECLARE
    user_t_id INTEGER;
BEGIN
    SELECT t_id INTO user_t_id
    FROM public.users
    WHERE u_id = NEW.u_id;

    INSERT INTO public.daily_n_consumed (u_id, n_id, date, n_consumed_amount, n_suggested_amount)
    SELECT
        NEW.u_id,
        fc.n_id,
        NEW.date,
        (fc.n_amount_in_100g_f / 100.0) * NEW.eaten_grams AS n_consumed_amount,
        COALESCE(d.sugg_n_amount, -1) AS n_suggested_amount
    FROM public.food_contain_nutrient fc
    LEFT JOIN public.dri d ON fc.n_id = d.n_id AND d.t_id = user_t_id
    WHERE fc.f_id = NEW.f_id
    ON CONFLICT (u_id, n_id, date)
    DO UPDATE SET
        n_consumed_amount = public.daily_n_consumed.n_consumed_amount + EXCLUDED.n_consumed_amount;
    RETURN NEW;
END;
