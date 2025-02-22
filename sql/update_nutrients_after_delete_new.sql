
DECLARE
    user_t_id INTEGER;
    nutrient_consumed_amount NUMERIC;
BEGIN
    -- Step 1: 找到用戶的 t_id (對應到 DRI 表)
    SELECT t_id INTO user_t_id
    FROM public.users
    WHERE u_id = OLD.u_id;

    -- Step 2: 更新 daily_n_consumed 表中的數據
    UPDATE public.daily_n_consumed
    SET
        n_consumed_amount = n_consumed_amount - (
            SELECT (fc.n_amount_in_100g_f / 100.0) * OLD.eaten_grams
            FROM public.food_contain_nutrient fc
            WHERE fc.f_id = OLD.f_id AND fc.n_id = public.daily_n_consumed.n_id
        )
    WHERE
        u_id = OLD.u_id
        AND date = OLD.date
        AND n_id IN (
            SELECT fc.n_id
            FROM public.food_contain_nutrient fc
            WHERE fc.f_id = OLD.f_id
        );

    -- Step 3: 刪除 n_consumed_amount 為 0 的條目（可選）
    DELETE FROM public.daily_n_consumed
    WHERE u_id = OLD.u_id
      AND date = OLD.date
      AND n_consumed_amount <= 0;

    RETURN OLD;
END;
