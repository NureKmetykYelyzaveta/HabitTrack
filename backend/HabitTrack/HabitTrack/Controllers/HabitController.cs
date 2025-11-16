using HabitTrack.Data;
using HabitTrack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HabitTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HabitController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/habit/user/{userId} - Отримати всі звички користувача
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserHabits(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return NotFound(new { message = "Користувача не знайдено." });

                var habits = await _context.Habits
                    .Where(h => h.UserId == userId && !h.Archived)
                    .Include(h => h.Completions)
                    .OrderByDescending(h => h.CreatedAt)
                    .ToListAsync();

                return Ok(habits.Select(h => new
                {
                    h.HabitId,
                    h.UserId,
                    h.Name,
                    h.Category,
                    h.Note,
                    h.Streak,
                    h.RepeatCount,
                    h.LastCheckDate,
                    h.CreatedAt,
                    h.Archived,
                    CompletionCount = h.Completions.Count
                }));
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Помилка при завантаженні звичок." });
            }
        }

        // GET: api/habit/{habitId} - Отримати одну звичку
        [HttpGet("{habitId}")]
        public async Task<IActionResult> GetHabit(int habitId)
        {
            try
            {
                var habit = await _context.Habits
                    .Include(h => h.Completions)
                    .FirstOrDefaultAsync(h => h.HabitId == habitId);

                if (habit == null)
                    return NotFound(new { message = "Звичку не знайдено." });

                return Ok(new
                {
                    habit.HabitId,
                    habit.UserId,
                    habit.Name,
                    habit.Category,
                    habit.Note,
                    habit.Streak,
                    habit.RepeatCount,
                    habit.LastCheckDate,
                    habit.CreatedAt,
                    CompletionCount = habit.Completions.Count
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Помилка при завантаженні звички." });
            }
        }

        // POST: api/habit - Створити нову звичку
        [HttpPost]
        public async Task<IActionResult> CreateHabit([FromBody] CreateHabitRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Name))
                    return BadRequest(new { message = "Назва звички обов'язкова." });

                if (request.UserId <= 0)
                    return BadRequest(new { message = "ID користувача некоректний." });

                var user = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                    return NotFound(new { message = "Користувача не знайдено." });

                var habit = new Habit
                {
                    UserId = request.UserId,
                    Name = request.Name.Trim(),
                    Category = request.Category ?? "інше",
                    Note = request.Note,
                    RepeatCount = request.RepeatCount ?? 0,
                    Streak = 0,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Habits.Add(habit);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Звичку успішно створено.",
                    habit = new
                    {
                        habit.HabitId,
                        habit.UserId,
                        habit.Name,
                        habit.Category,
                        habit.Note,
                        habit.Streak,
                        habit.RepeatCount,
                        habit.LastCheckDate,
                        habit.CreatedAt,
                        CompletionCount = 0
                    }
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Помилка при створенні звички." });
            }
        }

        // PUT: api/habit/{habitId} - Оновити звичку
        [HttpPut("{habitId}")]
        public async Task<IActionResult> UpdateHabit(int habitId, [FromBody] UpdateHabitRequest request)
        {
            try
            {
                var habit = await _context.Habits.FindAsync(habitId);
                if (habit == null)
                    return NotFound(new { message = "Звичку не знайдено." });

                if (request.UserId != habit.UserId)
                    return Unauthorized(new { message = "Ви не маєте прав редагувати цю звичку." });

                if (!string.IsNullOrWhiteSpace(request.Name))
                    habit.Name = request.Name.Trim();
                
                if (!string.IsNullOrWhiteSpace(request.Category))
                    habit.Category = request.Category;
                
                if (request.Note != null)
                    habit.Note = request.Note;
                
                if (request.RepeatCount.HasValue)
                    habit.RepeatCount = request.RepeatCount.Value;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Звичку успішно оновлено.",
                    habit = new
                    {
                        habit.HabitId,
                        habit.UserId,
                        habit.Name,
                        habit.Category,
                        habit.Note,
                        habit.Streak,
                        habit.RepeatCount,
                        habit.LastCheckDate,
                        habit.CreatedAt
                    }
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Помилка при оновленні звички." });
            }
        }

        // DELETE: api/habit/{habitId} - Видалити звичку
        [HttpDelete("{habitId}")]
        public async Task<IActionResult> DeleteHabit(int habitId, [FromQuery] int userId)
        {
            try
            {
                var habit = await _context.Habits.FindAsync(habitId);
                if (habit == null)
                    return NotFound(new { message = "Звичку не знайдено." });

                if (habit.UserId != userId)
                    return Unauthorized(new { message = "Ви не маєте прав видаляти цю звичку." });

                // Видаляємо всі completions для цієї звички
                var completions = await _context.HabitCompletions
                    .Where(c => c.HabitId == habitId)
                    .ToListAsync();
                _context.HabitCompletions.RemoveRange(completions);

                _context.Habits.Remove(habit);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Звичку успішно видалено." });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Помилка при видаленні звички." });
            }
        }

        // POST: api/habit/{habitId}/complete - Позначити звичку як виконану
        [HttpPost("{habitId}/complete")]
        public async Task<IActionResult> CompleteHabit(int habitId, [FromQuery] int userId)
        {
            try
            {
                var habit = await _context.Habits
                    .Include(h => h.Completions)
                    .FirstOrDefaultAsync(h => h.HabitId == habitId);

                if (habit == null)
                    return NotFound(new { message = "Звичку не знайдено." });

                if (habit.UserId != userId)
                    return Unauthorized(new { message = "Ви не маєте прав відмічати цю звичку." });

                var today = DateTime.UtcNow.Date;
                var completionsToday = habit.Completions.Count(c => c.CompletedAt.Date == today);

                if (completionsToday >= habit.RepeatCount)
                    return BadRequest(new { message = "Ліміт виконань на сьогодні досягнуто." });

                var completion = new HabitCompletion
                {
                    HabitId = habitId,
                    CompletedAt = DateTime.UtcNow,
                    CoinsEarned = 10
                };

                _context.HabitCompletions.Add(completion);
                await _context.SaveChangesAsync();

                completionsToday++;

                // Якщо досягнуто RepeatCount – оновлюємо streak
                if (completionsToday == habit.RepeatCount)
                {
                    var yesterday = today.AddDays(-1);
                    var completedYesterday = habit.Completions.Any(c => c.CompletedAt.Date == yesterday);

                    habit.Streak = completedYesterday ? habit.Streak + 1 : 1;
                    habit.LastCheckDate = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }

                return Ok(new
                {
                    message = "Виконання додано.",
                    completedToday = completionsToday,
                    target = habit.RepeatCount,
                    streak = habit.Streak
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Помилка при позначенні звички." });
            }
        }

        // DELETE: api/habit/{habitId}/complete/{completionId} - Видалити запис про виконання
        [HttpDelete("{habitId}/complete/{completionId}")]
        public async Task<IActionResult> UncompleteHabit(int habitId, int completionId, [FromQuery] int userId)
        {
            try
            {
                var habit = await _context.Habits.FindAsync(habitId);
                if (habit == null)
                    return NotFound(new { message = "Звичку не знайдено." });

                if (habit.UserId != userId)
                    return Unauthorized(new { message = "Ви не маєте прав редагувати цю звичку." });

                var completion = await _context.HabitCompletions.FindAsync(completionId);
                if (completion == null || completion.HabitId != habitId)
                    return NotFound(new { message = "Запис про виконання не знайдено." });

                _context.HabitCompletions.Remove(completion);
                
                // Перераховуємо streak
                var completions = await _context.HabitCompletions
                    .Where(c => c.HabitId == habitId)
                    .OrderByDescending(c => c.CompletedAt)
                    .ToListAsync();

                if (completions.Count == 0)
                {
                    habit.Streak = 0;
                }
                else
                {
                    // Перевіряємо послідовність днів
                    var streak = 1;
                    var lastDate = completions[0].CompletedAt.Date;
                    
                    for (int i = 1; i < completions.Count; i++)
                    {
                        var currentDate = completions[i].CompletedAt.Date;
                        if ((lastDate - currentDate).Days == 1)
                        {
                            streak++;
                            lastDate = currentDate;
                        }
                        else
                        {
                            break;
                        }
                    }
                    
                    habit.Streak = streak;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Запис про виконання успішно видалено.",
                    newStreak = habit.Streak
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Помилка при видаленні запису про виконання." });
            }
        }

        // GET: api/habit/user/{userId}/archived - Отримати архівовані звички користувача
        [HttpGet("user/{userId}/archived")]
        public async Task<IActionResult> GetArchivedHabits(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return NotFound(new { message = "Користувача не знайдено." });

                var habits = await _context.Habits
                    .Where(h => h.UserId == userId && h.Archived)
                    .Include(h => h.Completions)
                    .OrderByDescending(h => h.CreatedAt)
                    .ToListAsync();

                return Ok(habits.Select(h => new
                {
                    h.HabitId,
                    h.UserId,
                    h.Name,
                    h.Category,
                    h.Note,
                    h.Streak,
                    h.RepeatCount,
                    h.LastCheckDate,
                    h.CreatedAt,
                    h.Archived,
                    CompletionCount = h.Completions.Count
                }));
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Помилка при завантаженні архівованих звичок." });
            }
        }

        // POST: api/habit/{habitId}/archive - Архівувати звичку
        [HttpPost("{habitId}/archive")]
        public async Task<IActionResult> ArchiveHabit(int habitId, [FromQuery] int userId)
        {
            try
            {
                var habit = await _context.Habits.FindAsync(habitId);
                if (habit == null)
                    return NotFound(new { message = "Звичку не знайдено." });

                if (habit.UserId != userId)
                    return Unauthorized(new { message = "Ви не маєте прав архівувати цю звичку." });

                habit.Archived = true;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Звичку успішно архівовано." });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Помилка при архівуванні звички." });
            }
        }

        // POST: api/habit/{habitId}/unarchive - Відновити звичку з архіву
        [HttpPost("{habitId}/unarchive")]
        public async Task<IActionResult> UnarchiveHabit(int habitId, [FromQuery] int userId)
        {
            try
            {
                var habit = await _context.Habits.FindAsync(habitId);
                if (habit == null)
                    return NotFound(new { message = "Звичку не знайдено." });

                if (habit.UserId != userId)
                    return Unauthorized(new { message = "Ви не маєте прав відновлювати цю звичку." });

                habit.Archived = false;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Звичку успішно відновлено." });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Помилка при відновленні звички." });
            }
        }
    }

    // DTOs
    public class CreateHabitRequest
    {
        public int UserId { get; set; }
        public string? Name { get; set; }
        public string? Category { get; set; }
        public string? Note { get; set; }
        public int? RepeatCount { get; set; }
    }

    public class UpdateHabitRequest
    {
        public int UserId { get; set; }
        public string? Name { get; set; }
        public string? Category { get; set; }
        public string? Note { get; set; }
        public int? RepeatCount { get; set; }
    }
}
