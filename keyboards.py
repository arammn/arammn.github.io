from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from typing import List, Dict, Any

def build_group_selection_keyboard(groups):
    buttons = []
    for g in groups:
        title = g.get('title', f"Group {g['chat_id']}")
        if len(title) > 30: title = title[:27] + "..."
        buttons.append([InlineKeyboardButton(f"📱 {title} (ID: {g['chat_id']})", callback_data=f"select_group:{g['chat_id']}")])
    return InlineKeyboardMarkup(buttons)

def build_game_mode_keyboard(chat_id: int):
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("💰 Ивент (аукцион)", callback_data=f"auction_mode:{chat_id}")],
        [InlineKeyboardButton("🎰 Lucky Draw", callback_data=f"lucky_draw_mode:{chat_id}")],
        [InlineKeyboardButton("❌ Отмена", callback_data="cancel_action")]
    ])

def build_auction_options_keyboard(chat_id: int):
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("🚀 Стандартные настройки", callback_data=f"auction_default:{chat_id}")],
        [InlineKeyboardButton("⚙️ Свои настройки", callback_data=f"auction_custom:{chat_id}")],
        [InlineKeyboardButton("🔙 Назад", callback_data=f"back_to_mode:{chat_id}")]
    ])

def build_active_games_keyboard(games, draws):
    buttons = []
    for g in games:
        leader = g.get('leader_name', 'Нет ставок')
        buttons.append([InlineKeyboardButton(f"🛑 Аукцион {g['chat_id']} – {leader}", callback_data=f"stop_game:{g['chat_id']}")])
        buttons.append([InlineKeyboardButton(f"✏️ Изменить {g['chat_id']}", callback_data=f"edit_game:{g['chat_id']}")])
    for d in draws:
        buttons.append([InlineKeyboardButton(f"🎰 Lucky Draw {d['chat_id']} – {d['prize']}", callback_data=f"stop_lucky:{d['chat_id']}")])
    buttons.append([InlineKeyboardButton("Закрыть", callback_data="cancel_action")])
    return InlineKeyboardMarkup(buttons)

def build_edit_game_keyboard(chat_id: int):
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("⏱ Изменить время", callback_data=f"edit_timer:{chat_id}")],
        [InlineKeyboardButton("💎 Изменить звёзды", callback_data=f"edit_stars:{chat_id}")],
        [InlineKeyboardButton("🔙 Назад", callback_data=f"back_from_edit:{chat_id}")]
    ])

def build_confirm_stop_keyboard(chat_id: int, type_: str = "game"):
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("✅ Да, остановить", callback_data=f"confirm_stop_{type_}:{chat_id}"),
         InlineKeyboardButton("❌ Отмена", callback_data="cancel_action")]
    ])